import { create } from 'zustand';

import { argMax, meanVector, polyfitPxToNm } from '@/utils/signal';

export type CalibrationStep =
  | 'INTRO'
  | 'SETUP_ROI'
  | 'CAPTURE_LASERS'
  | 'FIT'
  | 'REVIEW'
  | 'SAVE';

export type LaserKey = 'green' | 'red' | 'blue';

export type RegionOfInterest = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface LaserCapture {
  wavelength: number;
  frames?: number[][];
  peakPx?: number;
}

export interface CalibrationFit {
  a0: number;
  a1: number;
  a2?: number;
  rmse: number;
  dispersion: number;
}

type CalibrationState = {
  step: CalibrationStep;
  roi: RegionOfInterest;
  locks: {
    exposure: boolean;
    whiteBalance: boolean;
  };
  lasers: Record<LaserKey, LaserCapture | null>;
  fit: CalibrationFit | null;
  isSaving: boolean;
  setStep: (step: CalibrationStep) => void;
  setROI: (roi: RegionOfInterest) => void;
  toggleLock: (lock: keyof CalibrationState['locks'], value?: boolean) => void;
  setLaserCapture: (key: LaserKey, capture: LaserCapture | null) => void;
  calculateFit: () => CalibrationFit | null;
  setFit: (fit: CalibrationFit | null) => void;
  setSaving: (flag: boolean) => void;
  reset: () => void;
};

const DEFAULT_ROI: RegionOfInterest = { x: 0, y: 0, width: 1024, height: 64 };

const computeDispersion = (fit: { a1: number; a2?: number }, peaks: number[]) => {
  if (!peaks.length) return fit.a1;
  const meanPx = peaks.reduce((acc, value) => acc + value, 0) / peaks.length;
  return fit.a2 ? fit.a1 + 2 * fit.a2 * meanPx : fit.a1;
};

export const useCalibrationStore = create<CalibrationState>((set, get) => ({
  step: 'INTRO',
  roi: DEFAULT_ROI,
  locks: { exposure: true, whiteBalance: true },
  lasers: { green: null, red: null, blue: null },
  fit: null,
  isSaving: false,
  setStep: (step) => set({ step }),
  setROI: (roi) => set({ roi }),
  toggleLock: (lock, value) =>
    set((state) => ({
      locks: { ...state.locks, [lock]: value ?? !state.locks[lock] },
    })),
  setLaserCapture: (key, capture) =>
    set((state) => {
      if (!capture) {
        return { lasers: { ...state.lasers, [key]: null }, fit: null };
      }
      if (capture.frames && !capture.peakPx) {
        const spectrum = meanVector(capture.frames);
        const peakPx = argMax(spectrum);
        capture = { ...capture, peakPx };
      }
      return { lasers: { ...state.lasers, [key]: capture }, fit: null };
    }),
  calculateFit: () => {
    const { lasers } = get();
    const validCaptures = (Object.values(lasers).filter(Boolean) as LaserCapture[]).filter(
      (capture) => typeof capture.wavelength === 'number' && (capture.peakPx ?? capture.frames)
    );

    if (validCaptures.length < 2) {
      set({ fit: null });
      return null;
    }

    const peaks = validCaptures.map((capture) => {
      if (typeof capture.peakPx === 'number') return capture.peakPx;
      if (capture.frames?.length) {
        const spectrum = meanVector(capture.frames);
        return argMax(spectrum);
      }
      return 0;
    });

    const points = validCaptures.map((capture, index) => ({
      nm: capture.wavelength,
      px: peaks[index],
    }));

    const fitResult = polyfitPxToNm(points);
    const dispersion = computeDispersion(fitResult, peaks);
    const fit: CalibrationFit = {
      a0: fitResult.a0,
      a1: fitResult.a1,
      a2: fitResult.a2,
      rmse: fitResult.rmse,
      dispersion,
    };
    set({ fit });
    return fit;
  },
  setFit: (fit) => set({ fit }),
  setSaving: (flag) => set({ isSaving: flag }),
  reset: () =>
    set({
      step: 'INTRO',
      roi: DEFAULT_ROI,
      lasers: { green: null, red: null, blue: null },
      fit: null,
      locks: { exposure: true, whiteBalance: true },
      isSaving: false,
    }),
}));

export const selectCalibrationFitQuality = (rmse: number | null | undefined) => {
  if (rmse === undefined || rmse === null) return 'unknown' as const;
  if (rmse <= 2) return 'ok' as const;
  if (rmse <= 3) return 'warn' as const;
  return 'error' as const;
};
