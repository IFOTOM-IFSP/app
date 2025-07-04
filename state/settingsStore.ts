
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const NOISE_METRIC_STORAGE_KEY = 'device_noise_metric';

interface DeviceSettingsState {
  darkNoiseStdDev: number | null;

  actions: {

    loadNoiseMetric: () => Promise<void>;
    setNoiseMetric: (newValue: number) => Promise<void>;
  };
}

export const useSettingsStore = create<DeviceSettingsState>((set) => ({
  darkNoiseStdDev: null,
  actions: {
    loadNoiseMetric: async () => {
      try {
        const storedValue = await AsyncStorage.getItem(NOISE_METRIC_STORAGE_KEY);
        if (storedValue !== null) {
          set({ darkNoiseStdDev: parseFloat(storedValue) });
          console.log('[settingsStore] Métrica de ruído carregada do storage:', storedValue);
        }
      } catch (error) {
        console.error('[settingsStore] Erro ao carregar a métrica de ruído.', error);
      }
    },
    setNoiseMetric: async (newValue) => {
      try {
        set({ darkNoiseStdDev: newValue });
        await AsyncStorage.setItem(NOISE_METRIC_STORAGE_KEY, newValue.toString());
        console.log('[settingsStore] Nova métrica de ruído salva no storage:', newValue);
      } catch (error) {
        console.error('[settingsStore] Erro ao salvar a métrica de ruído.', error);
      }
    },
  },
}));

export const useSettingsActions = () => useSettingsStore((state) => state.actions);

export const initializeSettings = () => {
    useSettingsStore.getState().actions.loadNoiseMetric();
}
