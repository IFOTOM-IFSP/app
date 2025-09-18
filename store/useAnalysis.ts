import { create } from "zustand";

type Phase = "idle"|"dark"|"white"|"sample"|"done";

type S = {
  phase: Phase;
  roi: {x:number;y:number;w:number;h:number}|null;
  dark?: number[][];
  white?: number[][];
  sample?: number[][];
  setROI(roi: S["roi"]): void;
  pushDark(vec: number[]): void;
  pushWhite(vec: number[]): void;
  pushSample(vec: number[]): void;
  reset(): void;
};

export const useAnalysis = create<S>((set, get) => ({
  phase: "idle",
  roi: null,
  setROI: (roi) => set({ roi }),
  pushDark: (v) => set(s => ({ dark: [...(s.dark||[]), v], phase: "white" })),     // simplificado
  pushWhite: (v) => set(s => ({ white: [...(s.white||[]), v], phase: "sample" })),
  pushSample: (v) => set(s => ({ sample: [...(s.sample||[]), v] })),
  reset: () => set({ phase: "idle", roi: null, dark: [], white: [], sample: [] })
}));
