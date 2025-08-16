import { ThemeColorName } from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';

export interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColorName: ThemeColorName;
  iconBackgroundColorName: ThemeColorName;
  route: string;
  actionText?: string;
}
