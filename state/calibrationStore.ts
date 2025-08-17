import { handleError } from '@/services/errorHandler';
import {
  deleteCurve as dbDeleteCurve,
  getAllCurves as dbGetAllCurves,
  saveCurve as dbSaveCurve,
  type CalibrationCurve
} from '@/storage/calibrationStorage';
import { create } from 'zustand';

interface CalibrationState {
  curves: CalibrationCurve[];
  isLoading: boolean;
}

interface CalibrationActions {
  init: () => Promise<void>;
  addCurve: (curveData: Omit<CalibrationCurve, 'id' | 'createdAt'>) => Promise<void>;
  removeCurve: (id: number) => Promise<void>;
}

export const useCalibrationStore = create<CalibrationState & { actions: CalibrationActions }>((set) => ({
  curves: [],
  isLoading: true,
  actions: {
    init: async () => {
      try {
        set({ isLoading: true });
        const curves = await dbGetAllCurves();
        set({ curves, isLoading: false });
      } catch (error) {
        handleError(error, 'calibrationStore:init');
        set({ isLoading: false });
      }
    },
    addCurve: async (curveData) => {
      try {
        const newCurve = await dbSaveCurve(curveData);
        set((state) => ({ curves: [newCurve, ...state.curves] }));
      } catch (error) {
        handleError(error, 'calibrationStore:addCurve');
        throw error;
      }
    },
    removeCurve: async (id) => {
      try {
        await dbDeleteCurve(id);
        set((state) => ({ curves: state.curves.filter((c) => c.id !== id) }));
      } catch (error) {
        handleError(error, 'calibrationStore:removeCurve');
        throw error;
      }
    },
  }
}));

export const useCalibrationActions = () => useCalibrationStore((state) => state.actions);
export const useAvailableCurves = () => useCalibrationStore((state) => state.curves);
export const useIsCalibrationsLoading = () => useCalibrationStore((state) => state.isLoading);
