import { IconLibrary } from "@/src/components/ui/icon/Icon";
import { IconButton } from "@/src/components/ui/icon/IconButton";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Spacing } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { router } from "expo-router";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

export interface SectionItem {
  id: string;
  label: string;
  iconName: string;
  iconLibrary: IconLibrary;
  isHome: boolean;
  noOptions?: boolean;
  route?: string;
  onPress?: () => void;
}

type Variant = "default" | "home" | "options";

export interface SectionsGridProps {
  sections: SectionItem[];
  title?: boolean;
  style?: StyleProp<ViewStyle>;
  numColumns?: number;
  variant?: Variant;
}

export function SectionsGrid({
  sections,
  title,
  style,
  numColumns = 4,
  variant = "default",
}: SectionsGridProps) {
  const cardColor = useThemeValue("card");
  const shadowColor = useThemeValue("shadow");
  const { width: screenWidth } = useWindowDimensions();

  const gap = Spacing.md * 2;
  const totalHorizontalPadding = Spacing.md * 2;
  const totalGap = gap * (numColumns - 1);
  const availableWidth = screenWidth - totalHorizontalPadding - totalGap;
  const itemSize = availableWidth / numColumns;

  const isVisible = (item: SectionItem) => {
    if (variant === "home" && item.isHome === false) return false;
    if (variant === "options" && item.noOptions === true) return false;
    return true;
  };

  const visible = sections.filter(isVisible);

  // key robusta: usa separador + fallback de rota
  const makeKey = (item: SectionItem) =>
    `${variant}::${item.id}::${item.route ?? "no-route"}`;

  if (__DEV__) {
    const seen = new Set<string>();
    for (const it of visible) {
      const k = makeKey(it);
      if (seen.has(k)) console.warn("Key duplicada:", k, it);
      seen.add(k);
    }
  }

  return (
    <View style={styles.container}>
      {title && <ThemedText style={styles.title}>Seções úteis</ThemedText>}
      <View style={[styles.iconsRowContainer, style]}>
        {visible.map((item) => (
          <IconButton
            key={makeKey(item)}
            onPress={() => {
              if (item.route) router.push(item.route);
              else item.onPress?.();
            }}
            label={item.label}
            iconName={item.iconName}
            iconLibrary={item.iconLibrary}
            iconSize={itemSize * 0.45}
            style={{ width: itemSize }}
            iconContainerStyle={[
              styles.iconContainer,
              {
                width: itemSize,
                height: itemSize,
                backgroundColor: cardColor,
                shadowColor: shadowColor,
              },
            ]}
            accessibilityLabel={"Ir para tela " + item.label}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Margin.sm,
    width: "100%",
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    marginBottom: Margin.sm,
  },
  iconsRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: Spacing.md,
  },
  iconContainer: {
    borderRadius: 10,
  },
});
