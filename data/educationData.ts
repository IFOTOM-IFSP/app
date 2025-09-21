import { HubItem } from "@/src/models";


export const EDUCATION_HUB_ITEMS: HubItem[] = [
  {
    id: 'modules',
    title: 'Módulos de Aprendizagem',
    subtitle: 'Aprofunde-se nos conceitos teóricos.',
    iconName: 'library-outline',
    iconColorName: 'primary', 
    iconBackgroundColorName: 'primaryBackground',
    route: '/(tabs)/education/modules',
    actionText: 'Explorar',
  },
  {
    id: 'challenges',
    title: 'Desafios e Quizzes',
    subtitle: 'Teste seus conhecimentos e pratique.',
    iconName: 'trophy-outline',
    iconColorName: 'green', 
    iconBackgroundColorName: 'greenBackground',
    route: '/(tabs)/education/quiz',
    actionText: 'Começar',
  },
  {
    id: 'glossary',
    title: 'Glossário',
    subtitle: 'Termos e definições importantes.',
    iconName: 'book-outline',
    iconColorName: 'blue', 
    iconBackgroundColorName: 'blueBackground',
    route: '/(tabs)/education/glossary',
    actionText: 'Consultar',
  },
  {
    id: 'references',
    title: 'Referências',
    subtitle: 'Aumente seu conhecimento.',
    iconName: 'link',
    iconColorName: 'pink',
    iconBackgroundColorName: 'pinkBackground',
    route: '/(tabs)/education/references',
    actionText: 'Explorar',
  },
];

export { HubItem };
