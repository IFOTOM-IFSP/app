import { handleError } from "@/services/errorHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SHOW_CONFIG_MODAL_KEY = "@should_show_config_modal";


export async function getShouldShowConfigModal(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(SHOW_CONFIG_MODAL_KEY);
    return value === null || value === "true";
  } catch (error) {
    handleError(error, "settingsStorage:getShouldShowConfigModal");
    return true;
  }
}


export async function setShouldShowConfigModal(
  shouldShow: boolean
): Promise<void> {
  try {
    await AsyncStorage.setItem(SHOW_CONFIG_MODAL_KEY, JSON.stringify(shouldShow));
  } catch (error) {
    handleError(error, "settingsStorage:setShouldShowConfigModal", {
      value: shouldShow,
    });
  }
}