// /hooks/useColorScheme.ts
import { useTheme } from '@/state/ThemeContext';

// Este hook agora lê o tema do nosso contexto, não mais do dispositivo diretamente.
export function useColorScheme() {
  const { colorTheme } = useTheme();
  return colorTheme;
}