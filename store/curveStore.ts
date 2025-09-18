import { create } from 'zustand';
import { CalibrationCurve } from '../models/CalibrationCurve';
import * as storage from '../src/native/storage/storageService';

interface CurveState {
  curves: CalibrationCurve[];
  isLoading: boolean;
  loadCurves: () => Promise<void>;
  addCurve: (newCurve: CalibrationCurve) => Promise<void>;
}

export const useCurveStore = create<CurveState>((set, get) => ({
  curves: [],
  isLoading: false,
  loadCurves: async () => {
    set({ isLoading: true });
    const loadedCurves = await storage.loadCurves();
    set({ curves: loadedCurves, isLoading: false });
  },
  addCurve: async (newCurve: CalibrationCurve) => {
    const updatedCurves = [...get().curves, newCurve];
    await storage.saveCurves(updatedCurves);
    set({ curves: updatedCurves });
  },
}));