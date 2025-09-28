import { handleError } from '@/services/errorHandler';
import {
  isFirstLaunch as checkFirstLaunch,
  clearFirstLaunch,
  getUserName,
  saveUserName as saveNameToStorage,
} from '@/src/storage/userStorage';
import { create } from 'zustand';

interface UserState {
  name: string | null;
  isFirstLaunch: boolean;
  isLoading: boolean;
}

interface UserActions {
  init: () => Promise<void>;
  saveName: (name: string) => Promise<void>;
  resetUser: () => Promise<void>;
  deleteAllData: () => Promise<void>;
}

export const useUserStore = create<UserState & { actions: UserActions }>((set, get) => ({
  name: null,
  isFirstLaunch: true,
  isLoading: true, 
  
  actions: {
    init: async () => {
      if (get().isLoading === false) {
              return;
            }
      try {
        const [name, firstLaunch] = await Promise.all([
          getUserName(),
          checkFirstLaunch(),
        ]);
        
        set({ name, isFirstLaunch: firstLaunch, isLoading: false });
      } catch (error) {
        handleError(error, 'userStore:init');
        set({ isLoading: false }); 
      }
    },
    
    saveName: async (newName: string) => {
      try {
        await saveNameToStorage(newName);
        set({ name: newName, isFirstLaunch: false });
      } catch (error) {
        throw handleError(error, 'userStore:saveName', { userName: newName });
      }
    },

    resetUser: async () => {
      try {
        await clearFirstLaunch(); 
        set({ name: null, isFirstLaunch: true });
      } catch (error) {
        throw handleError(error, 'userStore:resetUser');
      }
    },
    deleteAllData: async () => {
       
       set({ name: null, isFirstLaunch: true });
    },
  }
}));

export const useUserActions = () => useUserStore((state) => state.actions);
export const useUserName = () => useUserStore((state) => state.name);
export const useIsFirstLaunch = () => useUserStore((state) => state.isFirstLaunch);
export const useIsUserLoading = () => useUserStore((state) => state.isLoading);