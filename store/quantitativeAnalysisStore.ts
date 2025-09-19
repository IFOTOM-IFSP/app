import { create } from 'zustand';

type Burst = number[][];

export type AnalysisParams = {
  substance: string;
  wavelengthNm: number | null;
  windowNm: number;
  slope: number | null;
  intercept: number | null;
  pseudoDoubleBeam: boolean;
  selectedCurveId?: string | null;
};

type BurstKey = 'dark' | 'reference' | 'sample' | 'referenceAfter';

type QuantitativeAnalysisState = {
  params: AnalysisParams;
  bursts: Partial<Record<BurstKey, Burst>>;
  error?: string | null;
  setParam: <K extends keyof AnalysisParams>(key: K, value: AnalysisParams[K]) => void;
  setBursts: (key: BurstKey, frames: Burst | undefined) => void;
  resetBursts: () => void;
  reset: () => void;
  setError: (message: string | null) => void;
};

const DEFAULT_PARAMS: AnalysisParams = {
  substance: '',
  wavelengthNm: null,
  windowNm: 4,
  slope: null,
  intercept: null,
  pseudoDoubleBeam: false,
  selectedCurveId: null,
};

export const useQuantitativeAnalysisStore = create<QuantitativeAnalysisState>((set) => ({
  params: DEFAULT_PARAMS,
  bursts: {},
  error: null,
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
  setBursts: (key, frames) =>
    set((state) => ({ bursts: { ...state.bursts, [key]: frames } })),
  resetBursts: () => set({ bursts: {} }),
  reset: () => set({ params: DEFAULT_PARAMS, bursts: {}, error: null }),
  setError: (message) => set({ error: message }),
}));

export const isSlopeNearZero = (slope: number | null | undefined) => {
  if (slope === null || slope === undefined) return true;
  return Math.abs(slope) < 1e-6;
};
