import type { CalibrationCurve } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SavedCurve = {
  id: string;                  // uuid
  name: string;                // ex.: "Azul de metileno (lote 3)"
  createdAt: number;           // Date.now()

  curve: CalibrationCurve;     // m, b, R2, SEE, s_m, s_b, range, LOD, LOQ...
  lambda_nm: number;
  window_nm?: number;

  device_hash?: string;        // perfil do dispositivo usado
  substance?: string;          // substância associada
  notes?: string;              // observações livres
};

type CurveLibState = {
  curves: SavedCurve[];

  add: (c: Omit<SavedCurve, 'id' | 'createdAt'> & Partial<Pick<SavedCurve, 'id' | 'createdAt'>>) => SavedCurve;

  update: (id: string, patch: Partial<SavedCurve>) => void;

  upsert: (c: SavedCurve) => void;

  remove: (id: string) => void;

  clear: () => void;

  getById: (id: string) => SavedCurve | undefined;
};

function uuid(): string {
  if (typeof globalThis?.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useCurveLibraryStore = create<CurveLibState>()(
  persist(
    (set, get) => ({
      curves: [],

      add: (c) => {
        const item: SavedCurve = {
          id: c.id ?? uuid(),
          createdAt: c.createdAt ?? Date.now(),
          ...c,
        } as SavedCurve;
        set((state) => ({ curves: [item, ...state.curves] }));
        return item;
      },

      update: (id, patch) => {
        set((state) => ({
          curves: state.curves.map((it) => (it.id === id ? { ...it, ...patch, id: it.id } : it)),
        }));
      },

      upsert: (c) => {
        set((state) => {
          const idx = state.curves.findIndex((it) => it.id === c.id);
          if (idx >= 0) {
            const copy = state.curves.slice();
            copy[idx] = { ...state.curves[idx], ...c, id: state.curves[idx].id };
            return { curves: copy };
          }
          return { curves: [c, ...state.curves] };
        });
      },

      remove: (id) => set((state) => ({ curves: state.curves.filter((it) => it.id !== id) })),

      clear: () => set({ curves: [] }),

      getById: (id) => get().curves.find((c) => c.id === id),
    }),
    {
      name: 'ifotom-curves',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

export const useAllCurves = () => useCurveLibraryStore((s) => s.curves);
export const useCurveById = (id?: string) =>
  useCurveLibraryStore((s) => (id ? s.curves.find((c) => c.id === id) : undefined));
