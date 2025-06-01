const tintPrimary = '#A25CC7';         // Roxo principal mais sólido
const tintSecondary = '#CBA6E8';       // Lilás claro (para destaque e fundos)
const neutralBlack = '#1E1E1E';        // Preto para texto (mais suave que puro #000)
const neutralGray = '#6B6B6B';         // Cinza escuro para textos secundários
const neutralWhite = '#F4F2F8';        // Branco com leve toque lilás
const pureWhite = '#FFFFFF';          // Branco absoluto, para contraste máximo
const softIconGray = '#929292';        // Ícones em temas claros
const accentPurple = '#9D4EDD';        // Acentuado (usado em botões e links)

export const Colors = {
  light: {
    text: neutralBlack,                // Texto principal
    background: neutralWhite,          // Fundo do app
    tint: tintPrimary,                 // Cor principal da UI (botões, tabs, links)
    icon: softIconGray,                // Ícones normais
    tabIconDefault: softIconGray,
    tabIconSelected: tintPrimary,
    load: tintPrimary,
    tabs: tintPrimary,
    tabActive: accentPurple,           // Tab ativa com mais contraste
    cardBackground: tintSecondary,     // Cartões com leve cor de fundo
    textPrimary: neutralBlack,
    textSecondary: neutralGray,
    textWhite: pureWhite,
    accentPurple: accentPurple,
    buttonText: pureWhite,             // Para garantir contraste em botões coloridos
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintPrimary,
    load: accentPurple,
    tabs: tintPrimary,
    tabActive: accentPurple,
    cardBackground: '#202224',
    textPrimary: '#ECEDEE',
    textSecondary: '#B0B3B8',
    textWhite: pureWhite,
    accentPurple: accentPurple,
    buttonText: pureWhite,
  },
};
