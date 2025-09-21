import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ROI = { x: number; y: number; w: number; h: number };
export type PixelToNm = { a0: number; a1: number; a2?: number };
export type DeviceProfile = {
  device_hash: string;
  pixel_to_nm: PixelToNm;
  rmse_nm?: number;
  roi: ROI; // <- w/h aqui (NÃO width/height)
  dispersion_nm_per_px?: number;
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string } | Record<string, string>;
};

function normalizeFromAny(input: any | null): DeviceProfile | null {
  if (!input) return null;

  if (input.pixel_to_nm && input.roi && ('w' in input.roi)) {
    return {
      device_hash: String(input.device_hash ?? ''),
      pixel_to_nm: {
        a0: Number(input.pixel_to_nm.a0 ?? input.pixel_to_wavelength?.a0 ?? 0),
        a1: Number(input.pixel_to_nm.a1 ?? input.pixel_to_wavelength?.a1 ?? 0),
        a2: input.pixel_to_nm.a2 ?? input.pixel_to_wavelength?.a2,
      },
      rmse_nm: typeof input.rmse_nm === 'number' ? input.rmse_nm : input.pixel_to_wavelength?.rmse_nm,
      roi: {
        x: Number(input.roi.x ?? 0),
        y: Number(input.roi.y ?? 0),
        w: Number(input.roi.w ?? input.roi.width ?? 0),
        h: Number(input.roi.h ?? input.roi.height ?? 0),
      },
      dispersion_nm_per_px: input.dispersion_nm_per_px,
      camera_meta: input.camera_meta,
    };
  }

  const legacy = input as {
    device_hash?: string;
    pixel_to_wavelength?: { a0: number; a1: number; a2?: number; rmse_nm?: number };
    roi?: { x: number; y: number; width: number; height: number };
    camera_meta?: any;
  };

  if (legacy.pixel_to_wavelength && legacy.roi) {
    return {
      device_hash: String(legacy.device_hash ?? ''),
      pixel_to_nm: {
        a0: Number(legacy.pixel_to_wavelength.a0 ?? 0),
        a1: Number(legacy.pixel_to_wavelength.a1 ?? 0),
        a2: legacy.pixel_to_wavelength.a2,
      },
      rmse_nm: legacy.pixel_to_wavelength.rmse_nm,
      roi: {
        x: Number(legacy.roi.x ?? 0),
        y: Number(legacy.roi.y ?? 0),
        w: Number(legacy.roi.width ?? 0),
        h: Number(legacy.roi.height ?? 0),
      },
      camera_meta: legacy.camera_meta,
    };
  }

  return {
    device_hash: String(input.device_hash ?? ''),
    pixel_to_nm: {
      a0: Number(input.a0 ?? input.pixel_to_wavelength?.a0 ?? 0),
      a1: Number(input.a1 ?? input.pixel_to_wavelength?.a1 ?? 0),
      a2: input.a2 ?? input.pixel_to_wavelength?.a2,
    },
    rmse_nm: typeof input.rmse_nm === 'number' ? input.rmse_nm : input.pixel_to_wavelength?.rmse_nm,
    roi: {
      x: Number(input.x ?? input.roi?.x ?? 0),
      y: Number(input.y ?? input.roi?.y ?? 0),
      w: Number(input.w ?? input.roi?.w ?? input.roi?.width ?? 0),
      h: Number(input.h ?? input.roi?.h ?? input.roi?.height ?? 0),
    },
    camera_meta: input.camera_meta,
  };
}

type DeviceProfileState = {
  profile: DeviceProfile | null;
  status: 'idle' | 'ready';
  setProfile: (p: DeviceProfile) => void;
  updateProfile: (partial: Partial<DeviceProfile>) => void;
  clear: () => void;

  loadLegacyOnce: () => Promise<void>;
};

const STORAGE_KEY = 'device-profile-v2';
const LEGACY_KEYS = ['@ifotom/device_profile'];

export const useDeviceProfileStore = create<DeviceProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      status: 'idle',

      setProfile: (p) => set({ profile: normalizeFromAny(p), status: 'ready' }),

      updateProfile: (partial) => {
        const current = get().profile ?? ({} as DeviceProfile);
        set({ profile: normalizeFromAny({ ...current, ...partial }) });
      },

      clear: () => set({ profile: null, status: 'idle' }),

      // Migra perfil salvo em chaves antigas (roda uma vez — chame no bootstrap)
      loadLegacyOnce: async () => {
        if (get().status === 'ready' && get().profile) return;
        for (const k of LEGACY_KEYS) {
          const raw = await AsyncStorage.getItem(k);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              const norm = normalizeFromAny(parsed);
              if (norm) {
                set({ profile: norm, status: 'ready' });
                // move para o novo storage e limpa o antigo
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { profile: norm, status: 'ready' } }));
                await AsyncStorage.removeItem(k);
                return;
              }
            } catch {
              // ignore
            }
          }
        }
        // se não achou legado, só marca pronto
        set({ status: 'ready' });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      // migração de versões do próprio zustand (se mudar estrutura no futuro)
      migrate: (persisted: any, _v) => {
        const p = normalizeFromAny(persisted?.state?.profile ?? null);
        return { ...persisted.state, profile: p, status: p ? 'ready' : 'idle' };
      },
      partialize: (s) => ({ profile: s.profile, status: s.status }),
    }
  )
);

export async function loadDeviceProfile(): Promise<DeviceProfile | null> {
  await useDeviceProfileStore.getState().loadLegacyOnce();
  return useDeviceProfileStore.getState().profile;
}
export async function saveDeviceProfile(p: DeviceProfile): Promise<void> {
  useDeviceProfileStore.getState().setProfile(p);
}
export async function clearDeviceProfile(): Promise<void> {
  useDeviceProfileStore.getState().clear();
}
