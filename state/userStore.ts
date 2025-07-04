import {
  isFirstLaunch as checkFirstLaunch,
  clearFirstLaunch,
  getUserName,
  saveUserName as saveNameToStorage,
} from '@/storage/userStorage';
import { create } from 'zustand';

interface UserState {
  name: string | null;
  isFirstLaunch: boolean;
  isLoading: boolean;
  actions: {
    init: () => Promise<void>;
    saveName: (name: string) => Promise<void>;
    resetName: () => Promise<void>
    deleteAllData: () => Promise<void>
  };
}

export const useUserStore = create<UserState>((set, get) => ({
  name: null,
  isFirstLaunch: true,
  isLoading: true, 
  
 
  actions: {
    init: async () => {
      if (get().isLoading === false) {
              return;
            }
      try {
         
        console.log("Zustand [userStore]: Inicializando... Buscando dados do DB.");
        const [name, firstLaunch] = await Promise.all([
          getUserName(),
          checkFirstLaunch(),
        ]);
        
        set({ name, isFirstLaunch: firstLaunch, isLoading: false });
        console.log("Zustand [userStore]: Inicialização completa.");
      } catch (error) {
        console.error("Zustand [userStore]: Falha ao inicializar a store", error);
        set({ isLoading: false }); 
      }
    },
    
    saveName: async (newName: string) => {
      try {
        await saveNameToStorage(newName);
        set({ name: newName, isFirstLaunch: false });
        console.log("Zustand [userStore]: Nome salvo na store e no DB.");
      } catch (error) {
        console.error("Zustand [userStore]: Falha ao salvar o nome.", error);
        throw error;
      }
    },
    resetName: async () => {
      try {
        await clearFirstLaunch(); 
        set({ name: null, isFirstLaunch: true });
        console.log("Zustand [userStore]: Nome de usuário limpo na store e no DB.");
      } catch (error) {
        console.error("Zustand [userStore]: Falha ao limpar o nome.", error);
        throw error;
      }
    },
    deleteAllData: async () => {
       console.log("Lógica para deletar todos os dados do usuário executada.");
       set({ name: null, isFirstLaunch: true });
    },
  }
}));

export const useUserStoreActions = () => useUserStore((state) => state.actions);