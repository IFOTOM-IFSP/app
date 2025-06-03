// ---------------------------------------------------------------------------
// Paleta de Cores Base (Valores brutos, nomes não semânticos)
// ---------------------------------------------------------------------------

// Roxos e Lilases da Marca
const brandPurpleSolid = '#A25CC7';     // Roxo principal 
const brandLilacLight = '#CBA6E8';      // Lilás claro 
const brandAccentPurple = '#9D4EDD';    // Roxo para acentos vibrantes 


const legacyBrandPrimaryHex = "#B995C8";     
const legacyBrandPrimaryRgbEquiv = "#DAC5E4"; 
const legacyBackgroundLight = "#F3F3F3";     

// Neutros
const neutralCharcoal = '#1E1E1E';        // Preto suave para texto 
const neutralSteelGray = '#6B6B6B';         // Cinza escuro para textos secundários 
const neutralSoftIconGray = '#929292';     // Cinza para ícones em temas claros
const neutralOffWhiteLilac = '#F4F2F8';   // Branco com leve toque lilás 

// Comuns
const commonPureWhite = '#FFFFFF';         // Branco absoluto 

// Cores de Acento Adicionais (para status, categorias, etc.)
const accentPink = '#E91E63';
const accentPinkBg = '#FCE4EC';
const accentBlue = '#03A9F4';
const accentBlueBg = '#E1F5FE';
const accentGreen = '#4CAF50';
const accentGreenBg = '#E8F5E9';
const accentOrange = '#FF9800';
const accentOrangeBg = '#FFF3E0';

// Paleta Específica para Tema Escuro
const darkThemeText = '#ECEDEE';           // Texto principal no tema escuro
const darkThemeBackground = '#151718';      // Fundo principal no tema escuro
const darkThemeIcon = '#9BA1A6';            // Cor de ícone padrão no tema escuro
const darkThemeCardBg = '#202224';          // Fundo de cards no tema escuro
const darkThemeTextSecondary = '#B0B3B8';   // Texto secundário no tema escuro


export const PRIMARY_COLOR_HEX = legacyBrandPrimaryHex;
export const PRIMARY_COLOR_RGB = "rgb(218, 197, 228)"; 
export const BACKGROUND_COLOR_LIGHT = legacyBackgroundLight; 

// ---------------------------------------------------------------------------
// Objeto de Cores Semânticas para Temas
// ---------------------------------------------------------------------------
export const Colors = {
  light: {
    // Core
    text: neutralCharcoal,
    background: neutralOffWhiteLilac, // Fundo principal da aplicação em modo claro
    tint: brandPurpleSolid,          // Cor de destaque principal (usada em botões, abas ativas, etc.)

    // Variantes de Texto
    textPrimary: neutralCharcoal,
    textSecondary: neutralSteelGray,
    textWhite: commonPureWhite,      // Para texto sobre fundos escuros ou coloridos
    buttonText: commonPureWhite,     // Texto em botões com fundo 'tint'

    // Ícones
    icon: neutralSoftIconGray,       // Cor padrão para ícones
    tabIconDefault: neutralSoftIconGray,
    tabIconSelected: brandPurpleSolid,

    // Abas e Navegação
    tabsBackground: commonPureWhite, // Fundo da barra de abas (exemplo)
    tabActive: brandAccentPurple,    // Cor para uma aba/indicador muito ativo
    
    // Componentes
    cardBackground: commonPureWhite, // Fundo de cards 
    loadIndicator: brandPurpleSolid, // Cor para indicadores de carregamento
    
    // Cores de Acento e Status
    accentPurple: brandAccentPurple,
    pink: accentPink,
    pinkBackground: accentPinkBg,
    blue: accentBlue,
    blueBackground: accentBlueBg,
    green: accentGreen,
    greenBackground: accentGreenBg,
    orange: accentOrange,
    orangeBackground: accentOrangeBg,

    // Diversos
    gray: neutralSteelGray,
    borderColor: brandLilacLight, // Exemplo de cor para bordas sutis
  },
  dark: {
    // Core
    text: darkThemeText,
    background: darkThemeBackground,
    tint: brandPurpleSolid, // Pode precisar de um tom ligeiramente mais claro/vibrante no escuro

    // Variantes de Texto
    textPrimary: darkThemeText,
    textSecondary: darkThemeTextSecondary,
    textWhite: commonPureWhite,
    buttonText: commonPureWhite, // Geralmente mantido como branco para contraste

    // Ícones
    icon: darkThemeIcon,
    tabIconDefault: darkThemeIcon,
    tabIconSelected: brandPurpleSolid, // Ou brandAccentPurple se precisar de mais destaque

    // Abas e Navegação
    tabsBackground: darkThemeCardBg, // Fundo da barra de abas no tema escuro (exemplo)
    tabActive: brandAccentPurple,
    
    // Componentes
    cardBackground: darkThemeCardBg,
    loadIndicator: brandAccentPurple,
    
    // Cores de Acento e Status (podem precisar de ajustes para bom contraste no tema escuro)
    accentPurple: brandAccentPurple, // Revisar contraste
    pink: accentPink,               // Revisar contraste
    pinkBackground: darkThemeCardBg,  // Ex: usar texto pink sobre fundo de card escuro
    blue: accentBlue,
    blueBackground: darkThemeCardBg,
    green: accentGreen,
    greenBackground: darkThemeCardBg,
    orange: accentOrange,
    orangeBackground: darkThemeCardBg,

    // Diversos
    gray: darkThemeTextSecondary, // Usar um cinza mais claro do tema escuro
    borderColor: neutralSteelGray, // Exemplo de cor para bordas sutis
  },
};

