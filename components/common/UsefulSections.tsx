import { IconLibrary } from "@/components/ui/icon/Icon";
import { IconButton } from "@/components/ui/icon/IconButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Spacing } from "@/constants/Styles";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface SectionItem {
  id: string;
  label: string;
  iconName: string;
  iconLibrary: IconLibrary;
  onPress: () => void;
}

interface UsefulSectionsProps {
  sections: SectionItem[];
  title?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function UsefulSections({
  sections,
  title,
  style,
}: UsefulSectionsProps) {
  return (
    <View style={styles.container}>
      {title && <ThemedText style={styles.title}>Seções úteis</ThemedText>}
      <View style={[styles.iconsRowContainer, style]}>
        {sections.map((section) => {
          return (
            <View key={section.id} style={styles.iconButtonWrapper}>
              {/* 3. Usando a nova API do IconButton */}
              <IconButton
                onPress={section.onPress}
                label={section.label}
                iconName={section.iconName}
                iconLibrary={section.iconLibrary}
                iconSize={26}
                accessibilityLabel={"Ir para tela " + section.label}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
    marginBottom: Margin.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    marginBottom: Margin.md,
  },
  iconsRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    margin: -Spacing.md / 2,
  },
  iconButtonWrapper: {
    width: "25%",
    padding: Spacing.md / 2,
  },
});
