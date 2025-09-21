// store/settingsStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  learningMode: boolean;
  setLearningMode: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      learningMode: true, // ON por padrão
      setLearningMode: (v) => set({ learningMode: v }),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);
