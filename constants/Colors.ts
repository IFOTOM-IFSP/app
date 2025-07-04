// ====================================================================================
// PASSO 1: DEFINIR A PALETA DE CORES BASE (RAW PALETTE)
// Nossa única fonte da verdade para todos os valores de cor.
// Nenhuma alteração necessária aqui, a paleta já contém as cores que queremos.
// ====================================================================================

const RawPalette = {
  // 1. Cores da Marca (Brand)
  brand: {
    primary: '#9D4EDD',      // Roxo principal, vibrante (para ações primárias, tint)
    secondary: '#6A0DAD',     // Roxo mais escuro (para gradientes, textos de marca)
    light: '#CBA6E8',  
    bg_light: '#F3E5F5',      // Lilás claro (para fundos sutis, hovers, highlights)
  },

  // 2. Cores de Feedback (Semânticas)
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

    info_main: '#03A9F4', // Azul para Info
    info_bg_light: '#E1F5FE',
    info_bg_dark: 'rgba(3, 169, 244, 0.25)',
  },
  
  // 3. Cores Neutras (para textos, fundos, bordas)
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    
    // Tons para Modo Claro
    light_bg: '#F4F2F8',            // Fundo principal da tela
    light_card: '#FFFFFF',          // Fundo de cards/componentes
    light_text: '#1E1E1E',          // Texto principal
    light_text_secondary: '#6B6B6B',// Texto secundário
    light_icon: '#929292',          // Ícones
    light_border: 'rgba(0, 0, 0, 0.1)',
    light_disabled_bg: '#E0E0E0',
    light_disabled_text: '#BDBDBD',

  
    // Tons para Modo Escuro
    dark_bg: '#1C1C1E',             // Fundo principal da tela
    dark_card: '#2C2C2E',           // Fundo de cards/componentes
    dark_text: '#ECEDEE',           // Texto principal
    dark_text_secondary: '#B0B3B8', // Texto secundário
    dark_icon: '#9BA1A6',           // Ícones
    dark_border: 'rgba(255, 255, 255, 0.15)',    
    dark_disabled_bg: '#424242',
    dark_disabled_text: '#757575', 
  },

  // 4. Cores Estendidas (para categorias, gráficos, etc.)
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
  }
};


// ====================================================================================
// PASSO 2: DEFINIR A TIPAGEM DO TEMA (INTERFACE)
// Adicionadas as cores de categoria específicas.
// ====================================================================================

export type ThemeColorName = keyof ThemeColors;

export interface ThemeColors {
  // --- Core UI ---
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textWhite: string;
  icon: string;
  border: string;
  shadow: string;

  // --- Brand & Accents ---
  primary: string;
  primaryBackground: string; // ADICIONADO
  secondary: string;
  secondaryBackground: string;
  tint: string;
  
  // --- Components ---
  buttonText: string;
  loadIndicator: string;
  progressBarBackground: string;
  switchTrackFalse: string;
  switchTrackTrue: string;
  
  // --- Feedback & Status ---
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

  // --- Estados ---
  disabledBackground: string;
  disabledText: string;

  // --- ADICIONADO: Cores de Categoria para uso direto ---
  green: string;
  greenBackground: string;
  blue: string;
  blueBackground: string;
  pink: string;
  pinkBackground: string;

  // --- Specific Use Cases ---
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
  authGradient: readonly [string, string, string];
}

// ====================================================================================
// PASSO 3: CRIAR OS TEMAS MAPEANDO A PALETA BASE
// Adicionados os mapeamentos para as novas cores de categoria.
// ====================================================================================

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  // -------------------------
  // TEMA CLARO (LIGHT THEME)
  // -------------------------
  light: {
    // --- Core UI ---
    background: RawPalette.neutral.light_bg,
    card: RawPalette.neutral.light_card,
    text: RawPalette.neutral.light_text,
    textSecondary: RawPalette.neutral.light_text_secondary,
    textWhite: RawPalette.neutral.white,
    icon: RawPalette.neutral.light_icon,
    border: RawPalette.neutral.light_border,
    shadow: RawPalette.neutral.black,

    // --- Brand & Accents ---
    primary: RawPalette.brand.primary,
    primaryBackground: RawPalette.brand.bg_light, // ADICIONADO
    secondary: RawPalette.extended.teal_main,
    secondaryBackground: RawPalette.extended.teal_bg_light,
    tint: RawPalette.brand.primary,
    
    // --- Components ---
    buttonText: RawPalette.neutral.white,
    loadIndicator: RawPalette.brand.primary,
    progressBarBackground: RawPalette.neutral.light_border,
    switchTrackFalse: '#E9E9EA',
    switchTrackTrue: RawPalette.brand.light,

    // --- Feedback & Status ---
    success: RawPalette.feedback.success_main,
    successBackground: RawPalette.feedback.success_bg_light,
    successText: RawPalette.feedback.success_text,
    warning: RawPalette.feedback.warning_main,
    warningBackground: RawPalette.feedback.warning_bg_light,
    warningText: RawPalette.feedback.warning_text,
    danger: RawPalette.feedback.danger_main,
    dangerBackground: RawPalette.feedback.danger_bg_light,
    dangerText: RawPalette.feedback.danger_text,
    info: RawPalette.feedback.info_main, // Mantido como Azul
    infoBackground: RawPalette.feedback.info_bg_light,
    
    // --- Estados ---
    disabledBackground: RawPalette.neutral.light_disabled_bg,
    disabledText: RawPalette.neutral.light_disabled_text,

    // --- ADICIONADO: Mapeamento das Cores de Categoria ---
    green: RawPalette.feedback.success_main,
    greenBackground: RawPalette.feedback.success_bg_light,
    blue: RawPalette.feedback.info_main,
    blueBackground: RawPalette.feedback.info_bg_light,
    pink: RawPalette.extended.pink_main,
    pinkBackground: RawPalette.extended.pink_bg_light,

    // --- Specific Use Cases ---
    difficultyEasy: RawPalette.feedback.success_main,
    difficultyMedium: RawPalette.feedback.warning_main,
    difficultyHard: RawPalette.feedback.danger_main,
    authGradient: [RawPalette.brand.light, '#E3C7F4', RawPalette.neutral.light_bg],
  },
  
  // -------------------------
  // TEMA ESCURO (DARK THEME)
  // -------------------------
  dark: {
    // --- Core UI ---
    background: RawPalette.neutral.dark_bg,
    card: RawPalette.neutral.dark_card,
    text: RawPalette.neutral.dark_text,
    textSecondary: RawPalette.neutral.dark_text_secondary,
    textWhite: RawPalette.neutral.white,
    icon: RawPalette.neutral.dark_icon,
    border: RawPalette.neutral.dark_border,
    shadow: RawPalette.neutral.black,

    // --- Brand & Accents ---
    primary: RawPalette.brand.primary,
    primaryBackground: 'rgba(192, 132, 252, 0.2)', // ADICIONADO
    secondary: RawPalette.extended.teal_main,
    secondaryBackground: RawPalette.extended.teal_bg_dark,
    tint: RawPalette.brand.light,
    
    // --- Components ---
    buttonText: RawPalette.neutral.white,
    loadIndicator: RawPalette.brand.light,
    progressBarBackground: 'rgba(255, 255, 255, 0.2)',
    switchTrackFalse: '#3E3E3E',
    switchTrackTrue: RawPalette.brand.secondary,
    
    // --- Feedback & Status ---
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
    
    // --- Estados ---
    disabledBackground: RawPalette.neutral.dark_disabled_bg,
    disabledText: RawPalette.neutral.dark_disabled_text,
    
    // --- ADICIONADO: Mapeamento das Cores de Categoria ---
    green: RawPalette.feedback.success_main,
    greenBackground: RawPalette.feedback.success_bg_dark,
    blue: RawPalette.feedback.info_main,
    blueBackground: RawPalette.feedback.info_bg_dark,
    pink: RawPalette.extended.pink_main,
    pinkBackground: RawPalette.extended.pink_bg_dark,

    // --- Specific Use Cases ---
    difficultyEasy: RawPalette.feedback.success_main,
    difficultyMedium: RawPalette.feedback.warning_main,
    difficultyHard: RawPalette.feedback.danger_main,
    authGradient: [RawPalette.brand.secondary, '#3D0335', RawPalette.neutral.dark_bg],
  },
};