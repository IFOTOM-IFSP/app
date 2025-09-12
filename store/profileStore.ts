import { create } from 'zustand';
import { SpectrometerProfile } from '../models/SpectrometerProfile';
import * as storage from '../storage/storageService';

interface ProfileState {
  profiles: SpectrometerProfile[];
  isLoading: boolean;
  loadProfiles: () => Promise<void>;
  addProfile: (newProfile: SpectrometerProfile) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  isLoading: false,
  loadProfiles: async () => {
    set({ isLoading: true });
    const loadedProfiles = await storage.loadProfiles();
    set({ profiles: loadedProfiles, isLoading: false });
  },
  addProfile: async (newProfile: SpectrometerProfile) => {
    const currentProfiles = get().profiles;
    const updatedProfiles = [...currentProfiles, newProfile];
    await storage.saveProfiles(updatedProfiles);
    set({ profiles: updatedProfiles });
  },
  // Futuramente: removeProfile, updateProfile...
}));