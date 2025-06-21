
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

const NOTIFICATIONS_ENABLED_KEY = '@notifications_enabled';


async function askForPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Permissão de notificação não concedida!', 'Para receber lembretes, habilite as notificações nas configurações.');
    return false;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return true;
}

async function scheduleDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔬 Hora da Análise!',
      body: 'Não se esqueça de realizar sua análise espectrofotométrica hoje. Abra o iFOTOM!',
    },
    trigger: {
      hour: 12,
      minute: 0,
      repeats: true,
      channelId: 'default',
    },
  });
  console.log('Notificação diária agendada para as 12:00.');
}



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowInForeground: true,
    shouldShowInBackground: true,
    shouldShowInLockScreen: true,
  }),
});

interface UseNotificationsReturn {
  notificationsEnabled: boolean;
  toggleNotifications: (value: boolean) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadPreference = async () => {
      const storedPreference = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      setNotificationsEnabled(storedPreference === 'true');
    };
    loadPreference();
  }, []);

  const toggleNotifications = useCallback(async (value: boolean) => {
    if (value) {
      const hasPermission = await askForPermissions();
      if (hasPermission) {
        await scheduleDailyReminder();
        setNotificationsEnabled(true);
        await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'true');
      } else {
        setNotificationsEnabled(false);
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsEnabled(false);
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
      console.log('Notificações canceladas.');
    }
  }, []); 

  return {
    notificationsEnabled,
    toggleNotifications,
  };
}
