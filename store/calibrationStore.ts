import { create } from 'zustand';
import { meanVector, argMax, polyfitPxToNm } from '@/utils/signal';
import type { FitResult } from '@/utils/signal';

type ROI = { x: number; y: number; width: number; height: number };
export type LaserColor = 'green' | 'red' | 'blue';

type LaserMeasurement = {
  wavelength: number;
  frames: number[][];
};

type FitSummary = {
  coefficients: FitResult;
  peaks: Partial<Record<LaserColor, number>>;
  dispersionNmPerPx: number;
  rmseNm: number;
  usedPoints: { px: number; nm: number }[];
};

type CalibrationState = {
  roi: ROI;
  exposuresLocked: boolean;
  lasers: Partial<Record<LaserColor, LaserMeasurement>>;
  fit?: FitSummary;
  setRoi: (roi: ROI) => void;
  setExposureLocked: (locked: boolean) => void;
  setLaserFrames: (color: LaserColor, frames: number[][]) => void;
  setLaserWavelength: (color: LaserColor, wavelength: number) => void;
  reset: () => void;
};

const DEFAULT_ROI: ROI = { x: 0, y: 0, width: 1024, height: 80 };

function computeFit(lasers: Partial<Record<LaserColor, LaserMeasurement>>): FitSummary | undefined {
  const entries: [LaserColor, LaserMeasurement][] = [];
  (Object.keys(lasers) as LaserColor[]).forEach((color) => {
    const measurement = lasers[color];
    if (!measurement || !Array.isArray(measurement.frames) || measurement.frames.length === 0) {
      return;
    }
    entries.push([color, measurement]);
  });

  if (entries.length < 2) return undefined;

  const peaks = entries.map(([color, laser]) => {
    const avg = meanVector(laser.frames);
    return {
      color,
      wavelength: laser.wavelength,
      px: avg.length ? argMax(avg) : 0,
    };
  });

  const sortedByNm = [...peaks].sort((a, b) => a.wavelength - b.wavelength);

  let selected = sortedByNm;
  if (sortedByNm.length > 3) {
    const first = sortedByNm[0];
    const middle = sortedByNm[Math.floor(sortedByNm.length / 2)];
    const last = sortedByNm[sortedByNm.length - 1];
    selected = [first, middle, last];
  }

  const usedPoints = selected.slice(0, 3).map(({ px, wavelength }) => ({ px, nm: wavelength }));
  if (usedPoints.length < 2) return undefined;

  const coefficients = polyfitPxToNm(usedPoints);
  const peaksMap: Partial<Record<LaserColor, number>> = {};
  peaks.forEach((p) => {
    peaksMap[p.color] = p.px;
  });

  const pxSpan = Math.max(1, selected[selected.length - 1].px - selected[0].px);
  const nmSpan = selected[selected.length - 1].wavelength - selected[0].wavelength;
  const dispersionNmPerPx = nmSpan > 0 ? nmSpan / pxSpan : coefficients.a1;

  return {
    coefficients,
    peaks: peaksMap,
    dispersionNmPerPx,
    rmseNm: coefficients.rmse,
    usedPoints,
  };
}

export const useCalibrationStore = create<CalibrationState>((set) => ({
  roi: DEFAULT_ROI,
  exposuresLocked: true,
  lasers: {
    green: { wavelength: 532, frames: [] },
    red: { wavelength: 650, frames: [] },
  },
  fit: undefined,
  setRoi: (roi) => {
    set({ roi });
  },
  setExposureLocked: (locked) => set({ exposuresLocked: locked }),
  setLaserFrames: (color, frames) => {
    set((state) => {
      const next = {
        ...state.lasers,
        [color]: { ...(state.lasers[color] ?? { wavelength: color === 'green' ? 532 : color === 'red' ? 650 : 450 }), frames },
      };
      return {
        lasers: next,
        fit: computeFit(next),
      };
    });
  },
  setLaserWavelength: (color, wavelength) => {
    set((state) => {
      const next = {
        ...state.lasers,
        [color]: { frames: state.lasers[color]?.frames ?? [], wavelength },
      };
      return {
        lasers: next,
        fit: computeFit(next),
      };
    });
  },
  reset: () => {
    set({
      roi: DEFAULT_ROI,
      exposuresLocked: true,
      lasers: {
        green: { wavelength: 532, frames: [] },
        red: { wavelength: 650, frames: [] },
      },
      fit: undefined,
    });
  },
}));

export const CALIBRATION_DEFAULT_ROI = DEFAULT_ROI;
