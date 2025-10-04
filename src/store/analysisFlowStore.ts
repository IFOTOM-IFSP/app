import { create } from "zustand";

export type AnalysisType = "quantitativa" | "calibracao" | "espectro";

type Status =
  | "idle"
  | "type"       
  | "params"     
  | "acq_dark"
  | "acq_ref"
  | "acq_sample"
  | "acq_ref2"
  | "processing"
  | "result";

interface AnalysisFlowState {
  status: Status;
  type?: AnalysisType;
  canLeave: boolean; 
  start(type?: AnalysisType): void;
  setType(t: AnalysisType): void;
  toParams(): void;
  nextFromAcq(current: Exclude<Status, "idle" | "type" | "params" | "processing" | "result">): void;
  setProcessing(on: boolean): void;
  setResult(): void;
  cancel(): void; // zera tudo
}

export const useAnalysisFlowStore = create<AnalysisFlowState>((set) => ({
  status: "idle",
  type: undefined,
  canLeave: true,

  start: (t) => set(() => ({ status: t ? "params" : "type", type: t, canLeave: true })),
  setType: (t) => set(() => ({ type: t, status: "params", canLeave: true })),
  toParams: () => set(() => ({ status: "params", canLeave: true })),
  nextFromAcq: (current) =>
    set((s) => {
      const map: Record<Status, Status> = {
        acq_dark: "acq_ref",
        acq_ref: "acq_sample",
        acq_sample: "acq_ref2",
        acq_ref2: "processing",
      } as any;
      return { status: map[current] ?? s.status };
    }),
  setProcessing: (on) => set(() => ({ status: on ? "processing" : "result", canLeave: !on })),
  setResult: () => set(() => ({ status: "result", canLeave: true })),
  cancel: () =>
    set(() => ({
      status: "idle",
      type: undefined,
      canLeave: true,
    })),
}));
