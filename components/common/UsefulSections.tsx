import IconButton from "@/components/ui/IconButton";
import { ThemedIcon } from "@/components/ui/ThemedIcon";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Spacing } from "@/constants/Styles";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface SectionItem {
  id: string;
  label: string;
  iconName: string;
  iconComponent: React.ComponentType<any>;
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
              <IconButton
                onPress={section.onPress}
                labelText={section.label}
                iconElement={
                  <ThemedIcon
                    iconComponent={section.iconComponent}
                    name={section.iconName}
                    size={26}
                  />
                }
                iconOnly={false}
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
