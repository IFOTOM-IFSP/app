import { handleError } from '@/services/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATIONS_ENABLED_KEY = '@notifications_enabled';
const NOTIFICATION_CHANNEL_ID = 'daily-reminder';

async function askForPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permissão de notificação não concedida.');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
        name: 'Lembretes Diários',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    return true;
  } catch (error) {
    handleError(error, 'notificationsService:askForPermissions');
    return false;
  }
}

async function scheduleDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔬 Hora da Análise!',
        body: 'Não se esqueça de realizar a sua análise hoje. Abra o iFOTOM!',
      },
      trigger: {
        hour: 12,
        minute: 0,
        repeats: true,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });
    console.log('Serviço: Notificação diária agendada para as 12:00.');
  } catch (error) {
    handleError(error, 'notificationsService:scheduleDailyReminder');
    throw error;
  }
}

export const notificationsService = {

  initialize: async (): Promise<void> => {
    try {
      const storedPreference = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      if (storedPreference === 'true') {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === 'granted') {
          await scheduleDailyReminder();
        } else {
          await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
        }
      }
    } catch (error) {
      handleError(error, 'notificationsService:initialize');
    }
  },

  enable: async (): Promise<boolean> => {
    const hasPermission = await askForPermissions();
    if (!hasPermission) {
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
      return false;
    }
    try {
      await scheduleDailyReminder();
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'true');
      return true;
    } catch (error) {
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
      return false;
    }
  },

  disable: async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
      console.log('Serviço: Notificações canceladas.');
    } catch (error) {
      handleError(error, 'notificationsService:disable');
      throw error;
    }
  },

  loadPreference: async (): Promise<boolean> => {
    try {
      const storedPreference = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      return storedPreference === 'true';
    } catch (error) {
      handleError(error, 'notificationsService:loadPreference');
      return false;
    }
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowInForeground: true,
    shouldShowInBackground: true,
    shouldShowInLockScreen: true,
  }),
});
