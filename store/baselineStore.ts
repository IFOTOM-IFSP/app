import * as storage from '@/storage/storageService';
import { create } from 'zustand';
import { DualBeamImages } from './analysisStore';

interface BaselineState {
  darkSignalImages: DualBeamImages | null;
  whiteSignalImages: DualBeamImages | null;
  isLoaded: boolean;
  loadBaselineFromStorage: () => Promise<void>;
  setBaseline: (dark: DualBeamImages, white: DualBeamImages) => Promise<void>;
  clearBaseline: () => Promise<void>;
}

export const useBaselineStore = create<BaselineState>((set) => ({
  darkSignalImages: null,
  whiteSignalImages: null,
  isLoaded: false, 

  loadBaselineFromStorage: async () => {
    const baseline = await storage.loadBaseline();
    if (baseline) {
      set({ 
        darkSignalImages: baseline.darkSignalImages,
        whiteSignalImages: baseline.whiteSignalImages,
        isLoaded: true
      });
    } else {
      set({ isLoaded: true });
    }
  },

  setBaseline: async (dark, white) => {
    const baselineData = {
      darkSignalImages: dark,
      whiteSignalImages: white,
      timestamp: Date.now()
    };
    await storage.saveBaseline(baselineData);
    set({ darkSignalImages: dark, whiteSignalImages: white });
  },

  clearBaseline: async () => {
    await storage.clearBaseline();
    set({ darkSignalImages: null, whiteSignalImages: null });
  }
}));