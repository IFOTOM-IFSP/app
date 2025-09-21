// store/analysisHistoryStore.ts
import type { QuantAnalyzeResponse } from '@/types/api';
import type { AnalysisParams, DeviceProfile } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SavedAnalysis = {
  id: string;            // uuid
  ts: number;            // timestamp
  name: string;
  params: AnalysisParams;
  device_hash?: string;
  source?: 'api' | 'local';
  results: QuantAnalyzeResponse;
};

type HistoryState = {
  items: SavedAnalysis[];
  add: (a: SavedAnalysis) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useAnalysisHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (a) => set({ items: [a, ...get().items] }),
      remove: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'analysis-history', storage: createJSONStorage(() => AsyncStorage) }
  )
);

// helper para criar registro a partir do contexto atual
export function buildSavedAnalysis(
  params: AnalysisParams,
  result: QuantAnalyzeResponse,
  device?: DeviceProfile | null,
  source?: 'api' | 'local'
): SavedAnalysis {
  return {
    id: crypto.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2),
    ts: Date.now(),
    name: params?.name || 'Análise',
    params,
    device_hash: device?.device_hash,
    source,
    results: result,
  };
}
