import { getUserName as fetchUserNameFromStorage } from '@/storage/userStorage';
import { useEffect, useState } from 'react';

export function useUserName() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoadingName(true);
      try {
        const name = await fetchUserNameFromStorage();
        setUserName(name);
      } catch (error) {
        console.error("Falha ao carregar o nome do usuário:", error);
        setUserName(null); 
      } finally {
        setLoadingName(false);
      }
    };
    loadData();
  }, []);

  return { userName, loadingName };
}