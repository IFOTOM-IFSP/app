// store/curveLibraryStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CalibrationCoeffs = {
  m: number;
  b: number;
  R2?: number;
  SEE?: number;
  s_m?: number;
  s_b?: number;
};

export type SavedCurve = {
  id: string;
  name: string;
  substance?: string;
  lambda_nm: number;
  createdAt: number; // timestamp
  coeffs: CalibrationCoeffs; // <- canonical
  range?: { cmin: number; cmax: number };
};

// Tipo de entrada para o add(): aceita coeffs OU coefficients (legado)
type AddInput =
  Omit<SavedCurve, 'id' | 'createdAt' | 'coeffs'> &
  Partial<Pick<SavedCurve, 'id' | 'createdAt'>> & {
    coeffs?: CalibrationCoeffs;
    // suporte legado:
    coefficients?: CalibrationCoeffs;
  };

type CurveState = {
  items: SavedCurve[];
  add: (c: AddInput) => void;
  remove: (id: string) => void;
  clear: () => void;
  loadFromJSON?: (arr: any[]) => void; // opcional, migração em massa
};

export const useCurveLibraryStore = create<CurveState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (c) => {
        // normaliza id/createdAt
        const id =
          c.id ??
          (globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}_${Math.random().toString(16).slice(2)}`);
        const createdAt = typeof c.createdAt === 'number' ? c.createdAt : Date.now();

        // normaliza coeffs (aceita coefficients legado)
        const coeffs = c.coeffs ?? c.coefficients;
        if (!coeffs) {
          throw new Error('curveLibraryStore.add: faltam coefficients/coeffs');
        }

        // normaliza range (Cmin/Cmax → cmin/cmax)
        const range = c.range
          ? {
              cmin: (c.range as any).cmin ?? (c.range as any).Cmin,
              cmax: (c.range as any).cmax ?? (c.range as any).Cmax,
            }
          : undefined;

        const item: SavedCurve = {
          id,
          name: c.name,
          substance: c.substance,
          lambda_nm: c.lambda_nm,
          createdAt,
          coeffs: {
            m: Number(coeffs.m),
            b: Number(coeffs.b),
            R2: coeffs.R2,
            SEE: coeffs.SEE,
            s_m: coeffs.s_m,
            s_b: coeffs.s_b,
          },
          range,
        };

        set({ items: [item, ...get().items] });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
      // util opcional para migrar listas antigas já carregadas
      loadFromJSON: (arr) => {
        const normalized: SavedCurve[] = (arr ?? []).map((raw: any) => {
          const id =
            raw.id ??
            (globalThis.crypto?.randomUUID?.() ??
              `${Date.now()}_${Math.random().toString(16).slice(2)}`);
          const createdAt =
            typeof raw.createdAt === 'number'
              ? raw.createdAt
              : Date.now();

          const coeffs = raw.coeffs ?? raw.coefficients ?? {};
          const range = raw.range
            ? {
                cmin: raw.range.cmin ?? raw.range.Cmin,
                cmax: raw.range.cmax ?? raw.range.Cmax,
              }
            : undefined;

          return {
            id,
            name: String(raw.name ?? 'Curva'),
            substance: raw.substance,
            lambda_nm: Number(raw.lambda_nm ?? raw.wavelengthNm ?? 0),
            createdAt,
            coeffs: {
              m: Number(coeffs.m ?? coeffs.slope_m ?? 0),
              b: Number(coeffs.b ?? coeffs.intercept_b ?? 0),
              R2: coeffs.R2 ?? coeffs.r_squared,
              SEE: coeffs.SEE,
              s_m: coeffs.s_m,
              s_b: coeffs.s_b,
            },
            range,
          };
        });
        set({ items: normalized });
      },
    }),
    { name: 'curve-library', storage: createJSONStorage(() => AsyncStorage) }
  )
);
