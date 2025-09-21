import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useDeviceProfileStore } from './deviceProfileStore';

export type ROI = { x: number; y: number; w: number; h: number };
export type PixelToNm = { a0: number; a1: number; a2?: number };
export type DeviceProfile = {
  device_hash: string;
  pixel_to_nm: PixelToNm;
  rmse_nm?: number;
  roi: ROI;
  dispersion_nm_per_px?: number;
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string } | Record<string, string>;
};

export type ProfileEntry = {
  id: string;
  label: string;            // nome que o usuário vê
  profile: DeviceProfile;
  createdAt: number;
  updatedAt: number;
  notes?: string;
};

type LibraryState = {
  items: ProfileEntry[];
  selectedId?: string;

  add: (entry: Omit<ProfileEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  update: (id: string, partial: Partial<ProfileEntry>) => void;
  remove: (id: string) => void;
  select: (id: string) => void;

  // atalho: aplica o selecionado como perfil ativo no deviceProfileStore
  applySelectedToActive: () => void;
};

function uuid(): string {
  if (typeof globalThis?.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useProfileLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedId: undefined,

      add: (entry) => {
        const id = uuid();
        const now = Date.now();
        const newEntry: ProfileEntry = {
          id,
          label: entry.label,
          profile: entry.profile,
          createdAt: now,
          updatedAt: now,
          notes: entry.notes,
        };
        set({ items: [newEntry, ...get().items], selectedId: id });
        return id;
      },

      update: (id, partial) => {
        set({
          items: get().items.map((e) =>
            e.id === id ? { ...e, ...partial, updatedAt: Date.now() } : e
          ),
        });
      },

      remove: (id) => {
        const after = get().items.filter((e) => e.id !== id);
        const sel = get().selectedId === id ? undefined : get().selectedId;
        set({ items: after, selectedId: sel });
      },

      select: (id) => set({ selectedId: id }),

      applySelectedToActive: () => {
        const sel = get().items.find((e) => e.id === get().selectedId);
        if (sel) {
          // aplica na store do perfil ativo
          useDeviceProfileStore.getState().setProfile(sel.profile);
        }
      },
    }),
    {
      name: 'device-profile-library',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

const PROFILES_KEY = "spectrometer_profiles";

export type SpectrometerProfile = {
  id: string;
  name: string;
  calibrationDate: string; // ISO string
  device_hash: string;
  pixel_to_nm: { a0: number; a1: number; a2?: number; rmse_nm?: number };
  roi: { x: number; y: number; w: number; h: number };
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string } | Record<string, any>;
  rmse_nm?: number;
};

type ProfileState = {
  profiles: SpectrometerProfile[];
  isLoading: boolean;

  loadProfiles: () => Promise<void>;
  addProfile: (p: SpectrometerProfile) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
  clearProfiles: () => Promise<void>;
};

async function readAll(): Promise<SpectrometerProfile[]> {
  try {
    const s = await AsyncStorage.getItem(PROFILES_KEY);
    return s ? (JSON.parse(s) as SpectrometerProfile[]) : [];
  } catch {
    return [];
  }
}
async function writeAll(items: SpectrometerProfile[]) {
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(items));
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  isLoading: false,

  loadProfiles: async () => {
    set({ isLoading: true });
    const items = await readAll();
    set({ profiles: items, isLoading: false });
  },

  addProfile: async (p) => {
    const current = get().profiles;
    const updated = [p, ...current.filter((x) => x.id !== p.id)];
    await writeAll(updated);
    set({ profiles: updated });
  },

  removeProfile: async (id) => {
    const current = get().profiles;
    const updated = current.filter((x) => x.id !== id);
    await writeAll(updated);
    set({ profiles: updated });
  },

  clearProfiles: async () => {
    await writeAll([]);
    set({ profiles: [] });
  },
}));
