import { useTheme } from '@/state/ThemeContext';

export function useColorScheme() {
  const { colorTheme } = useTheme();
  return colorTheme;
}