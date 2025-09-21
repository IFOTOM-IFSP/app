
export const Spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  xxxxl: 56,
};

export const Padding = { ...Spacing };
export const Margin = { ...Spacing };

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  displaySm: 32,
  displayMd: 40,
  displayLg: 48,
};
export const FontWeight = {
  thin: "100",
  extraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
  black: "900",
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const LayoutSize = {
  screenPadding: Spacing.md,
  containerWidth: 320,
  contentMaxWidth: 600,
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 120,
  tabBarHeight: 60,
  iconContainerSize: 44,
};

export const Opacity = {
  disabled: 0.5,
  pressed: 0.7,
  hidden: 0,
  semi: 0.3,
  overlay: 0.6,
};


export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};
