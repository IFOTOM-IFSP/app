const DEFAULT_VECTOR_LENGTH = 640;
const DEFAULT_WAVELENGTH_RANGE = { minNm: 380, maxNm: 780 } as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const nmToIndex = (
  nm: number,
  length: number,
  range = DEFAULT_WAVELENGTH_RANGE
) => {
  const span = range.maxNm - range.minNm;
  if (span <= 0) return clamp(Math.round(length / 2), 0, length - 1);
  const normalized = (nm - range.minNm) / span;
  return clamp(Math.round(normalized * (length - 1)), 0, length - 1);
};

const gaussian = (x: number, mean: number, sigma: number) => {
  if (sigma <= 0) return 0;
  const diff = x - mean;
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
};

type PeakDescriptor = {
  nm: number;
  amplitude?: number;
  widthNm?: number;
  jitterNm?: number;
};

export type SyntheticBurstOptions = {
  frames: number;
  peaks?: PeakDescriptor[];
  baseline?: number;
  noise?: number;
  vectorLength?: number;
};

export const SYNTHETIC_VECTOR_LENGTH = DEFAULT_VECTOR_LENGTH;

const DEFAULT_BASELINE = 0.02;
const DEFAULT_NOISE = 0.01;

export const createSyntheticBurst = ({
  frames,
  peaks = [],
  baseline = DEFAULT_BASELINE,
  noise = DEFAULT_NOISE,
  vectorLength = DEFAULT_VECTOR_LENGTH,
}: SyntheticBurstOptions): number[][] => {
  const length = Math.max(8, vectorLength);
  return Array.from({ length: frames }, () => {
    const frame = new Array(length).fill(baseline);

    peaks.forEach((peak) => {
      const jitter = peak.jitterNm ?? 0;
      const centerNm = peak.nm + (jitter ? (Math.random() - 0.5) * 2 * jitter : 0);
      const centerIdx = nmToIndex(centerNm, length);
      const widthPx = Math.max(
        1,
        ((peak.widthNm ?? 4) / (DEFAULT_WAVELENGTH_RANGE.maxNm - DEFAULT_WAVELENGTH_RANGE.minNm)) * length
      );
      const amplitude = peak.amplitude ?? 1;

      for (let i = 0; i < length; i++) {
        frame[i] += amplitude * gaussian(i, centerIdx, widthPx);
      }
    });

    for (let i = 0; i < length; i++) {
      frame[i] = Math.max(0, frame[i] + noise * (Math.random() - 0.5));
    }

    return frame;
  });
};

export const createDarkBurst = (
  frames = 10,
  options: Partial<SyntheticBurstOptions> = {}
) =>
  createSyntheticBurst({
    frames,
    baseline: options.baseline ?? 0.005,
    noise: options.noise ?? 0.0025,
    peaks: [],
    vectorLength: options.vectorLength,
  });

export const createLaserBurst = (
  nm: number,
  frames = 10,
  options: Partial<SyntheticBurstOptions> = {}
) =>
  createSyntheticBurst({
    frames,
    baseline: options.baseline ?? 0.02,
    noise: options.noise ?? 0.01,
    peaks: [
      {
        nm,
        amplitude: options.peaks?.[0]?.amplitude ?? 1.2,
        widthNm: options.peaks?.[0]?.widthNm ?? 3,
        jitterNm: options.peaks?.[0]?.jitterNm ?? 0.8,
      },
    ],
    vectorLength: options.vectorLength,
  });

export const createReferenceBurst = (
  frames = 10,
  nm = 540,
  options: Partial<SyntheticBurstOptions> = {}
) =>
  createSyntheticBurst({
    frames,
    baseline: options.baseline ?? 0.12,
    noise: options.noise ?? 0.015,
    peaks: [
      {
        nm,
        amplitude: options.peaks?.[0]?.amplitude ?? 0.9,
        widthNm: options.peaks?.[0]?.widthNm ?? 6,
        jitterNm: options.peaks?.[0]?.jitterNm ?? 1.2,
      },
    ],
    vectorLength: options.vectorLength,
  });

export const createSampleBurst = (
  frames = 10,
  nm = 540,
  absorbance = 0.35,
  options: Partial<SyntheticBurstOptions> = {}
) => {
  const amplitude = clamp(1 - absorbance, 0.1, 1.1);
  return createSyntheticBurst({
    frames,
    baseline: options.baseline ?? 0.05,
    noise: options.noise ?? 0.012,
    peaks: [
      {
        nm,
        amplitude: options.peaks?.[0]?.amplitude ?? amplitude,
        widthNm: options.peaks?.[0]?.widthNm ?? 5,
        jitterNm: options.peaks?.[0]?.jitterNm ?? 1.5,
      },
    ],
    vectorLength: options.vectorLength,
  });
};
