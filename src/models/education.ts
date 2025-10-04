import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/Colors';

export interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColorName: ThemeColors;
  iconBackgroundColorName: ThemeColors;
  route: string;
  actionText?: string;
}
