const RawPalette = {
  brand: {
    primary: '#9D4EDD',
    secondary: '#6A0DAD',
    light: '#CBA6E8',
    bg_light: '#f4ecf5ff',
  },
  feedback: {
    success_main: '#28A745',
    success_bg_light: '#E8F5E9',
    success_bg_dark: 'rgba(40, 167, 69, 0.25)',
    success_text: '#155724',
    success_text_dark: '#C8E6C9',
    warning_main: '#FFC107',
    warning_bg_light: '#FFFBEA',
    warning_bg_dark: 'rgba(255, 193, 7, 0.25)',
    warning_text: '#5B4E1B',
    warning_text_dark: '#FDE68A',
    danger_main: '#DC3545',
    danger_bg_light: '#F8D7DA',
    danger_bg_dark: 'rgba(220, 53, 69, 0.25)',
    danger_text: '#721C24',
    danger_text_dark: '#F5C6CB',
    info_main: '#03A9F4',
    info_bg_light: '#E1F5FE',
    info_bg_dark: 'rgba(3, 169, 244, 0.25)',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    light_bg: '#faf6fdff',
    light_card: '#ffffffff',
    light_text: '#1E1E1E',
    light_text_secondary: '#6B6B6B',
    light_icon: '#929292',
    light_border: 'rgba(0, 0, 0, 0.1)',
    light_disabled_bg: '#E0E0E0',
    light_disabled_text: '#BDBDBD',
    dark_bg: '#121212',
    dark_card: '#1E1E1E',
    dark_text: '#ECEDEE',
    dark_text_secondary: '#B0B3B8',
    dark_icon: '#9BA1A6',
    dark_border: 'rgba(255, 255, 255, 0.2)',
    dark_disabled_bg: '#424242',
    dark_disabled_text: '#757575',
  },
  extended: {
    teal_main: '#009688',
    teal_bg_light: '#E0F2F1',
    teal_bg_dark: 'rgba(0, 150, 136, 0.25)',
    pink_main: '#E91E63',
    pink_bg_light: '#FCE4EC',
    pink_bg_dark: 'rgba(233, 30, 99, 0.25)',
    cyan_main: '#00BCD4',
    cyan_bg_light: '#E0F7FA',
    cyan_bg_dark: 'rgba(0, 188, 212, 0.25)',
  },
};

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textWhite: string;
  icon: string;
  border: string;
  shadow: string;
  primary: string;
  primaryBackground: string;
  secondary: string;
  secondaryBackground: string;
  tint: string;
  buttonText: string;
  loadIndicator: string;
  progressBarBackground: string;
  switchTrackFalse: string;
  switchTrackTrue: string;
  success: string;
  successBackground: string;
  successText: string;
  warning: string;
  warningBackground: string;
  warningText: string;
  danger: string;
  dangerBackground: string;
  dangerText: string;
  info: string;
  infoBackground: string;
  disabledBackground: string;
  disabledText: string;
  green: string;
  greenBackground: string;
  blue: string;
  blueBackground: string;
  pink: string;
  pinkBackground: string;
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
  authGradient: readonly [string, string, string];
  cardGradient: readonly [string, string, string];
}

export const AppThemes: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: RawPalette.neutral.light_bg,
    card: RawPalette.neutral.light_card,
    text: RawPalette.neutral.light_text,
    textSecondary: RawPalette.neutral.light_text_secondary,
    textWhite: RawPalette.neutral.white,
    icon: RawPalette.neutral.light_icon,
    border: RawPalette.neutral.light_border,
    shadow: RawPalette.neutral.black,
    primary: RawPalette.brand.primary,
    primaryBackground: RawPalette.brand.bg_light,
    secondary: RawPalette.extended.teal_main,
    secondaryBackground: RawPalette.extended.teal_bg_light,
    tint: RawPalette.brand.primary,
    buttonText: RawPalette.neutral.white,
    loadIndicator: RawPalette.brand.primary,
    progressBarBackground: RawPalette.neutral.light_border,
    switchTrackFalse: '#E9E9EA',
    switchTrackTrue: RawPalette.brand.light,
    success: RawPalette.feedback.success_main,
    successBackground: RawPalette.feedback.success_bg_light,
    successText: RawPalette.feedback.success_text,
    warning: RawPalette.feedback.warning_main,
    warningBackground: RawPalette.feedback.warning_bg_light,
    warningText: RawPalette.feedback.warning_text,
    danger: RawPalette.feedback.danger_main,
    dangerBackground: RawPalette.feedback.danger_bg_light,
    dangerText: RawPalette.feedback.danger_text,
    info: RawPalette.feedback.info_main,
    infoBackground: RawPalette.feedback.info_bg_light,
    disabledBackground: RawPalette.neutral.light_disabled_bg,
    disabledText: RawPalette.neutral.light_disabled_text,
    green: RawPalette.feedback.success_main,
    greenBackground: RawPalette.feedback.success_bg_light,
    blue: RawPalette.feedback.info_main,
    blueBackground: RawPalette.feedback.info_bg_light,
    pink: RawPalette.extended.pink_main,
    pinkBackground: RawPalette.extended.pink_bg_light,
    difficultyEasy: RawPalette.feedback.success_main,
    difficultyMedium: RawPalette.feedback.warning_main,
    difficultyHard: RawPalette.feedback.danger_main,
    authGradient: [RawPalette.brand.light, '#E3C7F4', RawPalette.neutral.light_bg],
    cardGradient: [RawPalette.brand.primary, "rgb(201, 132, 241)", "rgb(231, 217, 238)" ],
  },
  dark: {
    background: RawPalette.neutral.dark_bg,
    card: RawPalette.neutral.dark_card,
    text: RawPalette.neutral.dark_text,
    textSecondary: RawPalette.neutral.dark_text_secondary,
    textWhite: RawPalette.neutral.white,
    icon: RawPalette.neutral.dark_icon,
    border: RawPalette.neutral.dark_border,
    shadow: RawPalette.neutral.black,
    primary: RawPalette.brand.primary,
    primaryBackground: 'rgba(192, 132, 252, 0.2)',
    secondary: RawPalette.extended.teal_main,
    secondaryBackground: RawPalette.extended.teal_bg_dark,
    tint: RawPalette.brand.light,
    buttonText: RawPalette.neutral.white,
    loadIndicator: RawPalette.brand.light,
    progressBarBackground: 'rgba(255, 255, 255, 0.2)',
    switchTrackFalse: '#3E3E3E',
    switchTrackTrue: RawPalette.brand.secondary,
    success: RawPalette.feedback.success_main,
    successBackground: RawPalette.feedback.success_bg_dark,
    successText: RawPalette.feedback.success_text_dark,
    warning: RawPalette.feedback.warning_main,
    warningBackground: RawPalette.feedback.warning_bg_dark,
    warningText: RawPalette.feedback.warning_text_dark,
    danger: RawPalette.feedback.danger_main,
    dangerBackground: RawPalette.feedback.danger_bg_dark,
    dangerText: RawPalette.feedback.danger_text_dark,
    info: RawPalette.feedback.info_main,
    infoBackground: RawPalette.feedback.info_bg_dark,
    disabledBackground: RawPalette.neutral.dark_disabled_bg,
    disabledText: RawPalette.neutral.dark_disabled_text,
    green: RawPalette.feedback.success_main,
    greenBackground: RawPalette.feedback.success_bg_dark,
    blue: RawPalette.feedback.info_main,
    blueBackground: RawPalette.feedback.info_bg_dark,
    pink: RawPalette.extended.pink_main,
    pinkBackground: RawPalette.extended.pink_bg_dark,
    difficultyEasy: RawPalette.feedback.success_main,
    difficultyMedium: RawPalette.feedback.warning_main,
    difficultyHard: RawPalette.feedback.danger_main,
    authGradient: [RawPalette.brand.secondary, '#3D0335', RawPalette.neutral.dark_bg],
    cardGradient: [RawPalette.brand.primary, "rgb(101, 33, 110)", "rgb(80, 4, 80)" ],
  },
};
