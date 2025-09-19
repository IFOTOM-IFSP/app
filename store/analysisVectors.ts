import { create } from 'zustand';

type VectorsState = {
  dark: number[][];
  ref: number[][];
  sample: number[][];
  refAfter?: number[][];
  setDark: (v: number[][]) => void;
  setRef: (v: number[][]) => void;
  setSample: (v: number[][]) => void;
  setRefAfter: (v?: number[][]) => void;
  reset: () => void;
};

export const useVectorsStore = create<VectorsState>((set) => ({
  dark: [],
  ref: [],
  sample: [],
  refAfter: undefined,
  setDark: (v) => set({ dark: v }),
  setRef: (v) => set({ ref: v }),
  setSample: (v) => set({ sample: v }),
  setRefAfter: (v) => set({ refAfter: v }),
  reset: () => set({ dark: [], ref: [], sample: [], refAfter: undefined }),
}));
