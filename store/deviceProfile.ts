import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DeviceProfile = {
  device_hash: string;
  pixel_to_wavelength: { a0: number; a1: number; a2?: number; rmse_nm?: number };
  roi: { x: number; y: number; width: number; height: number };
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string };
};

type State = {
  profile?: DeviceProfile;
  setProfile: (p: DeviceProfile) => Promise<void>;
  load: () => Promise<void>;
  clear: () => Promise<void>;
};

export const useDeviceProfile = create<State>((set) => ({
  profile: undefined,
  setProfile: async (p) => {
    await AsyncStorage.setItem('@ifotom/device_profile', JSON.stringify(p));
    set({ profile: p });
  },
  load: async () => {
    const s = await AsyncStorage.getItem('@ifotom/device_profile');
    if (s) set({ profile: JSON.parse(s) });
  },
  clear: async () => {
    await AsyncStorage.removeItem('@ifotom/device_profile');
    set({ profile: undefined });
  },
}));
