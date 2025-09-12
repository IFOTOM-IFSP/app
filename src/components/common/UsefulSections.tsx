import { IconLibrary } from "@/components/ui/icon/Icon";
import { IconButton } from "@/components/ui/icon/IconButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

interface SectionItem {
  id: string;
  label: string;
  iconName: string;
  iconLibrary: IconLibrary;
  onPress: () => void;
}

export interface UsefulSectionsProps {
  sections: SectionItem[];
  title?: boolean;
  style?: StyleProp<ViewStyle>;
  numColumns?: number;
}

export function UsefulSections({
  sections,
  title,
  style,
  numColumns = 4,
}: UsefulSectionsProps) {
  const cardColor = useThemeValue("card");
  const shadowColor = useThemeValue("shadow");
  const { width: screenWidth } = useWindowDimensions();

  const gap = Spacing.md * 2;

  const totalHorizontalPadding = Spacing.md * 2;
  const totalGap = gap * (numColumns - 1);
  const availableWidth = screenWidth - totalHorizontalPadding - totalGap;
  const itemSize = availableWidth / numColumns;

  return (
    <View style={styles.container}>
      {title && <ThemedText style={styles.title}>Seções úteis</ThemedText>}
      <View style={[styles.iconsRowContainer, style]}>
        {sections.map((item) => (
          <IconButton
            key={item.id}
            onPress={item.onPress}
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
