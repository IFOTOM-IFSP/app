import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_NAME_KEY = '@EspectrometriaApp:userName';
const FIRST_LAUNCH_KEY = '@EspectrometriaApp:firstLaunch';

export const saveUserName = async (name: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_NAME_KEY, name);
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false'); 
  } catch (error) {
    console.error('Erro ao salvar o nome do usuário:', error);
  }
};

export const getUserName = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USER_NAME_KEY);
  } catch (error) {
    console.error('Erro ao buscar o nome do usuário:', error);
    return null;
  }
};

export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const firstLaunchStatus = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    return firstLaunchStatus === null;
  } catch (error) {
    console.error('Erro ao verificar o primeiro lançamento:', error);
    return true; 
  }
};

// para limpeza
export const clearFirstLaunch = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(USER_NAME_KEY);
        await AsyncStorage.removeItem(FIRST_LAUNCH_KEY);
    } catch (error) {
        console.error('Erro ao limpar o status de primeiro lançamento:', error);
    }
}