import { create } from 'zustand';

export type CurveStandard = {
  id: string;
  concentration: number;
  absorbance?: number | null;
  darkCaptured: boolean;
  referenceCaptured: boolean;
  sampleCaptured: boolean;
};

export type CurveFit = {
  slope: number;
  intercept: number;
  rSquared: number;
  see: number;
  lod: number | null;
  loq: number | null;
};

type CurveBuilderState = {
  standards: CurveStandard[];
  fit: CurveFit | null;
  error?: string | null;
  addStandard: () => void;
  updateStandard: (id: string, payload: Partial<CurveStandard>) => void;
  removeStandard: (id: string) => void;
  calculateFit: () => CurveFit | null;
  reset: () => void;
};

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `std-${Math.random().toString(36).slice(2, 11)}`;

const INITIAL_STANDARD = (): CurveStandard => ({
  id: createId(),
  concentration: 0,
  absorbance: null,
  darkCaptured: false,
  referenceCaptured: false,
  sampleCaptured: false,
});

const computeRegression = (standards: CurveStandard[]): CurveFit | null => {
  const points = standards.filter(
    (standard) =>
      typeof standard.concentration === 'number' &&
      Number.isFinite(standard.concentration) &&
      typeof standard.absorbance === 'number' &&
      Number.isFinite(standard.absorbance)
  ) as Required<CurveStandard>[];

  if (points.length < 2) return null;

  const n = points.length;
  const sumX = points.reduce((acc, item) => acc + item.concentration, 0);
  const sumY = points.reduce((acc, item) => acc + (item.absorbance ?? 0), 0);
  const sumXY = points.reduce((acc, item) => acc + item.concentration * (item.absorbance ?? 0), 0);
  const sumX2 = points.reduce((acc, item) => acc + item.concentration * item.concentration, 0);
  const sumY2 = points.reduce((acc, item) => acc + (item.absorbance ?? 0) * (item.absorbance ?? 0), 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (Math.abs(denominator) < 1e-12) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const predicted = points.map((item) => slope * item.concentration + intercept);
  const meanY = sumY / n;
  const ssTot = sumY2 - n * meanY * meanY;
  const residuals = points.map((item, index) => (item.absorbance ?? 0) - predicted[index]);
  const ssRes = residuals.reduce((acc, value) => acc + value * value, 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  const see = Math.sqrt(ssRes / Math.max(1, n - 2));

  const lod = slope === 0 ? null : (3 * see) / Math.abs(slope);
  const loq = slope === 0 ? null : (10 * see) / Math.abs(slope);

  return { slope, intercept, rSquared, see, lod, loq };
};

export const useCalibrationCurveBuilderStore = create<CurveBuilderState>((set, get) => ({
  standards: [INITIAL_STANDARD()],
  fit: null,
  error: null,
  addStandard: () =>
    set((state) => ({ standards: [...state.standards, INITIAL_STANDARD()], fit: null })),
  updateStandard: (id, payload) =>
    set((state) => ({
      standards: state.standards.map((standard) =>
        standard.id === id ? { ...standard, ...payload } : standard
      ),
      fit: null,
    })),
  removeStandard: (id) =>
    set((state) => ({
      standards: state.standards.filter((standard) => standard.id !== id),
      fit: null,
    })),
  calculateFit: () => {
    const { standards } = get();
    const fit = computeRegression(standards);
    set({ fit });
    return fit;
  },
  reset: () => set({ standards: [INITIAL_STANDARD()], fit: null, error: null }),
}));
