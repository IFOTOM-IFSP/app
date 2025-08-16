import { notificationsService } from '@/services/notificationService';
import { useCallback, useEffect, useState } from 'react';

interface UseNotificationsReturn {
  isLoading: boolean;
  notificationsEnabled: boolean;
  toggleNotifications: (value: boolean) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const isEnabled = await notificationsService.loadPreference();
      setNotificationsEnabled(isEnabled);
      setIsLoading(false);
    };
    initialize();
  }, []);

  const toggleNotifications = useCallback(async (shouldEnable: boolean) => {
    setIsLoading(true);
    if (shouldEnable) {
      const success = await notificationsService.enable();
      setNotificationsEnabled(success);
    } else {
      await notificationsService.disable();
      setNotificationsEnabled(false);
    }
    setIsLoading(false);
  }, []); 

  return {
    isLoading,
    notificationsEnabled,
    toggleNotifications,
  };
}
