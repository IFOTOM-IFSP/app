
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const NOTIFICATIONS_ENABLED_KEY = '@notifications_enabled';


export async function initializeNotifications() {
  try {
    const storedPreference = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    
    if (storedPreference === 'true') {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        console.log('Serviço: Notificações ativas. Reagendando lembrete diário...');
        await scheduleDailyReminder();
      } else {
        console.log('Serviço: Notificações estavam ativas, mas a permissão foi removida.');
      }
    } else {
      console.log('Serviço: Notificações não estão ativas. Nenhum agendamento necessário.');
    }
  } catch (e) {
    console.error("Falha ao inicializar o serviço de notificações.", e);
  }
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
  console.log('Serviço: Notificação diária agendada para as 12:00.');
}
