
import { ThemeColorName } from '@/constants/Colors';
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


export const EDUCATION_HUB_ITEMS: HubItem[] = [
  {
    id: 'modules',
    title: 'Módulos de Aprendizagem',
    subtitle: 'Aprofunde-se nos conceitos teóricos.',
    iconName: 'library-outline',
    iconColorName: 'iconThemePurple', 
    iconBackgroundColorName: 'iconThemePurpleBackground', 
    route: '/(tabs)/education/modules/',
    actionText: 'Explorar',
  },
  {
    id: 'challenges',
    title: 'Desafios e Quizzes',
    subtitle: 'Teste seus conhecimentos e pratique.',
    iconName: 'trophy-outline',
    iconColorName: 'iconThemeGreen', 
    iconBackgroundColorName: 'iconThemeGreenBackground',
    route: '/(tabs)/education/quiz',
    actionText: 'Começar',
  },
  {
    id: 'glossary',
    title: 'Glossário',
    subtitle: 'Termos e definições importantes.',
    iconName: 'book-outline',
    iconColorName: 'iconThemeBlue', 
    iconBackgroundColorName: 'iconThemeBlueBackground',
    route: '/(tabs)/education/glossary',
    actionText: 'Consultar',
  },
  {
    id: 'references',
    title: 'Referências',
    subtitle: 'Aumente seu conhecimento.',
    iconName: 'link',
    iconColorName: 'iconThemePink', 
    iconBackgroundColorName: 'iconThemePinkBackground',
    route: '/(tabs)/education/references',
    actionText: 'Explorar',
  },
];