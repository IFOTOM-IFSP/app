import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ProcessingStrategy = 'auto' | 'local' | 'online';

type SettingsState = {
  learningMode: boolean;                 // mostra explicações/ajuda
  defaultProcessing: ProcessingStrategy; // estratégia padrão para novas análises
  defaultFramesPerBurst: number;         // ex.: 10
  defaultWindowNm: number;               // ex.: 4 (Δ total)

  autosaveResults: boolean;              // salvar resultado ao finalizar

  setLearningMode: (v: boolean) => void;
  setDefaultProcessing: (s: ProcessingStrategy) => void;
  setDefaultFramesPerBurst: (n: number) => void;
  setDefaultWindowNm: (n: number) => void;
  setAutosaveResults: (v: boolean) => void;

  reset: () => void;
};

const DEFAULTS: Omit<SettingsState,
  | 'setLearningMode'
  | 'setDefaultProcessing'
  | 'setDefaultFramesPerBurst'
  | 'setDefaultWindowNm'
  | 'setAutosaveResults'
  | 'reset'
> = {
  learningMode: true,
  defaultProcessing: 'auto',
  defaultFramesPerBurst: 10,
  defaultWindowNm: 4,
  autosaveResults: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setLearningMode: (v) => set({ learningMode: v }),
      setDefaultProcessing: (s) => set({ defaultProcessing: s }),
      setDefaultFramesPerBurst: (n) =>
        set({ defaultFramesPerBurst: Math.max(1, Math.floor(n || 1)) }),
      setDefaultWindowNm: (n) =>
        set({ defaultWindowNm: Math.max(1, Number.isFinite(n) ? n : 4) }),
      setAutosaveResults: (v) => set({ autosaveResults: v }),

      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: 'ifotom-settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted, _v) => {
        const s = (persisted as any)?.state ?? {};
        return {
          ...DEFAULTS,
          ...s,
          defaultFramesPerBurst: Math.max(1, Math.floor(s.defaultFramesPerBurst ?? DEFAULTS.defaultFramesPerBurst)),
          defaultWindowNm: Math.max(1, Number.isFinite(s.defaultWindowNm) ? s.defaultWindowNm : DEFAULTS.defaultWindowNm),
        };
      },
      partialize: (s) => ({
        learningMode: s.learningMode,
        defaultProcessing: s.defaultProcessing,
        defaultFramesPerBurst: s.defaultFramesPerBurst,
        defaultWindowNm: s.defaultWindowNm,
        autosaveResults: s.autosaveResults,
      }),
    }
  )
);
