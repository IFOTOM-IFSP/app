import { Colors, type ThemeColors } from "@/constants/Colors";
import { useTheme } from "../state/ThemeContext";

export function useThemeValue<K extends keyof ThemeColors>(
  key: K
): ThemeColors[K] {
  const { colorTheme } = useTheme();

  return Colors[colorTheme][key];
}
