import { AppThemes, type ThemeColors } from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

export function useThemeValue<K extends keyof ThemeColors>(
  key: K
): ThemeColors[K] {
  const theme = useColorScheme();

  return AppThemes[theme][key];
}
