import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackgroundColor: string;
  route: string; 
  actionText?: string;
}

export const EDUCATION_HUB_ITEMS: HubItem[] = [
  {
    id: 'modules',
    title: 'Módulos de Aprendizagem',
    subtitle: 'Aprofunde-se nos conceitos teóricos.',
    iconName: 'library-outline',
    iconColor: Colors.light.accentPurple || '#9D4EDD',
    iconBackgroundColor: `${Colors.light.accentPurple || '#9D4EDD'}20`, 
    route: '/(tabs)/education/modules/',
    actionText: 'Explorar',
  },
  // {
  //   id: 'tools',
  //   title: 'Ferramentas Interativas',
  //   subtitle: 'Simuladores, calculadoras e mais.',
  //   iconName: 'construct-outline',
  //   iconColor: Colors.light.orange || '#FF9800', 
  //   iconBackgroundColor: Colors.light.orangeBackground || '#FFF3E0', 
  //   route: '/(tabs)/education/tools',
  //   actionText: 'Acessar',
  // },
  {
    id: 'challenges',
    title: 'Desafios e Quizzes',
    subtitle: 'Teste seus conhecimentos e pratique.',
    iconName: 'trophy-outline',
    iconColor: Colors.light.green || '#4CAF50', 
    iconBackgroundColor: Colors.light.greenBackground || '#E8F5E9',
    route: '/(tabs)/education/challenges',
    actionText: 'Começar',
  },
  {
    id: 'glossary',
    title: 'Glossário',
    subtitle: 'Termos e definições importantes.',
    iconName: 'book-outline',
    iconColor: Colors.light.blue || '#03A9F4',
    iconBackgroundColor: Colors.light.blueBackground || '#E1F5FE',
    route: '/(tabs)/education/glossary',
    actionText: 'Consultar',
  },
  {
    id: 'references',
    title: 'Referências',
    subtitle: 'Aumente seu conhecimento.',
    iconName: 'link',
    iconColor: Colors.light.pink || '#E91E63', 
    iconBackgroundColor: Colors.light.pinkBackground || '#FCE4EC',
    route: '/(tabs)/education/referencia',
    actionText: 'Explorar',
  },
];