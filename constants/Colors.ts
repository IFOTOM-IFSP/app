// Primárias (Marca)
const COLOR_PRIMARY = '#A25CC7';         // Roxo principal
const COLOR_PRIMARY_LIGHT = '#CBA6E8';   // Lilás claro
const COLOR_PRIMARY_ACCENT = '#9D4EDD';  // Roxo vibrante para acentos

// Neutros
const COLOR_NEUTRAL_TEXT = '#1E1E1E';        // Texto principal (modo claro)
const COLOR_NEUTRAL_SECONDARY = '#6B6B6B';   // Texto secundário
const COLOR_NEUTRAL_ICON = '#929292';        // Ícones neutros (modo claro)
const COLOR_NEUTRAL_BG_LIGHT = '#F4F2F8';    // Fundo claro com toque lilás
const COLOR_WHITE = '#FFFFFF';

// Acentos (status, categorias, feedback)
const COLOR_PINK = '#E91E63';
const COLOR_PINK_BG = '#FCE4EC';
const COLOR_BLUE = '#03A9F4';
const COLOR_BLUE_BG = '#E1F5FE';
const COLOR_GREEN = '#4CAF50';
const COLOR_GREEN_BG = '#E8F5E9';
const COLOR_ORANGE = '#FF9800';
const COLOR_ORANGE_BG = '#FFF3E0';

// Tema Escuro
const COLOR_DARK_TEXT = '#ECEDEE';
const COLOR_DARK_TEXT_SECONDARY = '#B0B3B8';
const COLOR_DARK_ICON = '#9BA1A6';
const COLOR_DARK_BG = '#272727';
const COLOR_DARK_CARD = '#202224';

type ColorValueKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];
export type ThemeColorName = ColorValueKeys<ThemeColors>;
export interface ThemeColors {
  text: string;
  textPrimary: string;
  textSecondary: string;
  textWhite: string;
  buttonText: string;
  background: string;
  cardBackground: string;
  borderColor: string;
  tint: string;
  tabActive: string;
  tabIconSelected: string;
  icon: string;
  tabIconDefault: string;
  accentPurple: string;
  pink: string;
  pinkBackground: string;
  blue: string;
  blueBackground: string;
  green: string;
  shadowColor: string,
  greenBackground: string;
  orange: string;
  orangeBackground: string;
  tabsBackground: string;
  loadIndicator: string;
  dangerText: string;
  dangerBackground: string;
  switchTrackFalse:string;
  switchTrackTrue: string;
  switchThumbDisabled:string;
  gray: string;
  authGradient: readonly [string, string, ...string[]];
  cardGradient: readonly [string, string, ...string[]];
  iconThemePurple: string;
  iconThemePurpleBackground: string;
  iconThemeGreen: string;
  iconThemeGreenBackground: string;
  iconThemeBlue: string;
  iconThemeBlueBackground: string;
  iconThemePink: string;
  iconThemePinkBackground: string;
  imagePlaceholder: string;
  placeholderGradient: readonly [string, string, ...string[]];
  cardBorder: string;
    iconThemeOrange: string;
  iconThemeOrangeBackground: string;
  iconThemeTeal: string;
  iconThemeTealBackground: string;
  iconThemeCyan: string;
  iconThemeCyanBackground: string;
   blockquoteBackground: string;
  blockquoteBorder: string;
  noteBackground: string;
  noteBorder: string;
  noteText: string;
  codeBlockBackground: string;
  codeLangText: string; // Cor para o nome da linguagem (ex: JAVASCRIPT)
  codeBodyText: string;
    formulaBackground: string;
  solvedInputBackground: string;
  solvedInputBorder: string;
  dotBackground: string;
    difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
    correctBackground: string;
  correctBorder: string;
  correctText: string;
  incorrectBackground: string;
  incorrectBorder: string;
  incorrectText: string;
  progressBarBackground: string;
}
export const Colors: { light: ThemeColors; dark: ThemeColors }  = {
  light: {   difficultyEasy: "#28A745",
    difficultyMedium: "#FFC107",
    difficultyHard: "#DC3545",
    // Base
      dotBackground: 'rgba(107, 70, 193, 0.5)',
    correctBackground: '#D4EDDA',
    correctBorder: '#28A745',
    correctText: '#155724',
    incorrectBackground: '#F8D7DA',
    incorrectBorder: '#DC3545',
    incorrectText: '#721C24',
    progressBarBackground: '#E9ECEF',
      formulaBackground: 'rgba(0,0,0,0.02)',
  solvedInputBackground: 'rgba(107, 70, 193, 0.05)',
  solvedInputBorder: 'rgba(107, 70, 193, 0.2)',
    text: COLOR_NEUTRAL_TEXT,
    textPrimary: COLOR_NEUTRAL_TEXT,
    textSecondary: COLOR_NEUTRAL_SECONDARY,
    textWhite: COLOR_WHITE,
    buttonText: COLOR_WHITE,
 blockquoteBackground: 'rgba(107, 70, 193, 0.05)',
    blockquoteBorder: '#9D4EDD', // accentPurple
    noteBackground: 'rgba(255, 229, 100, 0.15)',
    noteBorder: '#FFC107',
    noteText: '#5B4E1B',
    background: COLOR_NEUTRAL_BG_LIGHT,
    cardBackground: COLOR_WHITE,
    borderColor: COLOR_PRIMARY_LIGHT,
    shadowColor: "#000",
    cardBorder: 'rgba(0, 0, 0, 0.05)',
    imagePlaceholder: '#F0F0F0',
    placeholderGradient: ['#E3DFFf', '#EAD5E6'],
    // Acento
    tint: COLOR_PRIMARY,
    tabActive: COLOR_PRIMARY_ACCENT,
    tabIconSelected: COLOR_PRIMARY,
    icon: COLOR_NEUTRAL_ICON,
    tabIconDefault: COLOR_NEUTRAL_ICON,

    // Status
    accentPurple: COLOR_PRIMARY_ACCENT,
    pink: COLOR_PINK,
    pinkBackground: COLOR_PINK_BG,
    blue: COLOR_BLUE,
    blueBackground: COLOR_BLUE_BG,
    green: COLOR_GREEN,
    greenBackground: COLOR_GREEN_BG,
    orange: COLOR_ORANGE,
    orangeBackground: COLOR_ORANGE_BG,

    // Diversos
    tabsBackground: COLOR_WHITE,
    loadIndicator: COLOR_PRIMARY,
    gray: COLOR_NEUTRAL_SECONDARY,
    authGradient: [COLOR_PRIMARY_LIGHT, '#E3C7F4', COLOR_WHITE, COLOR_WHITE] as const,
    cardGradient: ['#8A4DBC', '#6A0DAD'] as const,
    dangerText: '#D93A3A',
    dangerBackground: '#FFE0E0',
    switchTrackFalse: '#E9E9EA',
    switchTrackTrue: '#C1B2F3',
    switchThumbDisabled: '#f4f3f4',
        iconThemePurple: '#9D4EDD',
    iconThemePurpleBackground: '#F3E5F5', // Um roxo bem claro
    iconThemeGreen: '#4CAF50',
    iconThemeGreenBackground: '#E8F5E9',
    iconThemeBlue: '#03A9F4',
    iconThemeBlueBackground: '#E1F5FE',
    iconThemePink: '#E91E63',
    iconThemePinkBackground: '#FCE4EC',
        iconThemeOrange: '#F57C00',
    iconThemeOrangeBackground: '#FFF3E0',
    iconThemeTeal: '#00796B',
    iconThemeTealBackground: '#E0F2F1',
    iconThemeCyan: '#0097A7',
    iconThemeCyanBackground: '#E0F7FA',
 codeBlockBackground: '#1E1E1E',
    codeLangText: '#9CDCFE',
    codeBodyText: '#D4D4D4',
    
  },

  dark: {
    // Ba
     correctBackground: 'rgba(40, 167, 69, 0.2)',
    correctBorder: '#28A745',
    correctText: '#C8E6C9',
    incorrectBackground: 'rgba(220, 53, 69, 0.2)',
    incorrectBorder: '#DC3545',
    incorrectText: '#F5C6CB',
    progressBarBackground: '#495057',
      
    difficultyEasy: "#28A745",
    difficultyMedium: "#FFC107",
    difficultyHard: "#DC3545",

      dotBackground: 'rgba(192, 132, 252, 0.4)',

     formulaBackground: 'rgba(255,255,255,0.05)',
  solvedInputBackground: 'rgba(192, 132, 252, 0.1)',
  solvedInputBorder: 'rgba(192, 132, 252, 0.3)',
     codeBlockBackground: '#1E1E1E',
    codeLangText: '#9CDCFE',
    codeBodyText: '#D4D4D4',
    text: COLOR_DARK_TEXT,
    textPrimary: COLOR_DARK_TEXT,
    textSecondary: COLOR_DARK_TEXT_SECONDARY,
    textWhite: COLOR_WHITE,
    buttonText: COLOR_WHITE,
blockquoteBackground: 'rgba(192, 132, 252, 0.1)',
    blockquoteBorder: '#C084FC', // accentPurple mais claro
    noteBackground: 'rgba(250, 204, 21, 0.15)',
    noteBorder: '#FACC15',
    noteText: '#FDE68A',
    background: COLOR_DARK_BG,
    cardBackground: COLOR_DARK_CARD,
    borderColor: COLOR_DARK_TEXT_SECONDARY,
    shadowColor: '#ffffff',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    imagePlaceholder: '#333333',
    placeholderGradient: ['#3E2A4C', '#4C2A40'],
    // Acento
    tint: COLOR_PRIMARY, // Ajustável para mais brilho se necessário
    tabActive: COLOR_PRIMARY_ACCENT,
    tabIconSelected: COLOR_PRIMARY_ACCENT,
    icon: COLOR_DARK_ICON,
    tabIconDefault: COLOR_DARK_ICON,

    // Status (em fundo escuro, usar fundo escuro para manter contraste)
    accentPurple: COLOR_PRIMARY_ACCENT,
    pink: COLOR_PINK,
    pinkBackground: COLOR_DARK_CARD,
    blue: COLOR_BLUE,
    blueBackground: COLOR_DARK_CARD,
    green: COLOR_GREEN,
    greenBackground: COLOR_DARK_CARD,
    orange: COLOR_ORANGE,
    orangeBackground: COLOR_DARK_CARD,

    // Diversos
    loadIndicator: COLOR_PRIMARY_ACCENT,
    gray: COLOR_DARK_TEXT_SECONDARY,
    authGradient: ['rgba(85, 7, 85, 0.98)', 'rgb(61, 3, 53)', COLOR_DARK_BG, COLOR_DARK_BG] as const,
    tabsBackground: COLOR_DARK_CARD,
    cardGradient: ['#4A0E69', '#3B0A5A'] as const,
    dangerText: '#FF8A8A',
    dangerBackground: '#4B1F1F',
    switchTrackFalse: '#3E3E3E',
    switchTrackTrue: '#5B41A5',
    switchThumbDisabled: '#a9a9a9',
    iconThemePurple: '#C482F7', 
    iconThemePurpleBackground: '#4A235A', 
    iconThemeGreen: '#81C784',
    iconThemeGreenBackground: '#1B5E20',
    iconThemeBlue: '#4FC3F7',
    iconThemeBlueBackground: '#01579B',
    iconThemePink: '#F48FB1',
    iconThemePinkBackground: '#880E4F',
     iconThemeOrange: '#FFA726',
    iconThemeOrangeBackground: '#5D4037',
    iconThemeTeal: '#4DB6AC',
    iconThemeTealBackground: '#004D40',
    iconThemeCyan: '#4DD0E1',
    iconThemeCyanBackground: '#006064',
  },
};
