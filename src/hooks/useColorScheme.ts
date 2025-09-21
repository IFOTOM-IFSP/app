import { useTheme } from '@/src/store/ThemeContext';

export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}