import { handleError } from '@/services/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const NOISE_METRIC_STORAGE_KEY = 'device_noise_metric';


interface DeviceSettingsState {
  darkNoiseStdDev: number | null;
}

interface DeviceSettingsActions {
  init: () => Promise<void>;
  setNoiseMetric: (newValue: number) => Promise<void>;
}

export const useSettingsStore = create<
  DeviceSettingsState & { actions: DeviceSettingsActions }
>((set) => ({
  darkNoiseStdDev: null,
  actions: {
    init: async () => {
      try {
        const storedValue = await AsyncStorage.getItem(NOISE_METRIC_STORAGE_KEY);
        if (storedValue !== null) {
          const parsedValue = parseFloat(storedValue);
          set({ darkNoiseStdDev: parsedValue });
          console.log('[settingsStore] Métrica de ruído carregada do storage:', parsedValue);
        }
      } catch (error) {
        handleError(error, 'settingsStore:init');
      }
    },
    setNoiseMetric: async (newValue: number) => {
      try {
        set({ darkNoiseStdDev: newValue });
        await AsyncStorage.setItem(
          NOISE_METRIC_STORAGE_KEY,
          newValue.toString()
        );
        console.log('[settingsStore] Nova métrica de ruído salva no storage:', newValue);
      } catch (error) {
        handleError(error, 'settingsStore:setNoiseMetric', { noiseValue: newValue });
        throw error;
      }
    },
  },
}));

export const useSettingsActions = () => useSettingsStore((state) => state.actions);

export const useDarkNoiseStdDev = () => useSettingsStore((state) => state.darkNoiseStdDev);


export const initializeSettings = () => {
    useSettingsStore.getState().actions.init();
}
