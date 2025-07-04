import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, Margin, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ObjectiveItemProps {
  text: string;
}

export function ObjectiveItem({ text }: ObjectiveItemProps) {
  const tintColor = useThemeValue("primary");

  return (
    <View style={styles.objectiveItem}>
      <Ionicons
        name="checkmark-circle-outline"
        size={22}
        color={tintColor}
        style={styles.objectiveIcon}
      />
      <ThemedText style={styles.objectiveText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  objectiveItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Margin.md,
  },
  objectiveIcon: {
    marginRight: Margin.md,
  },
  objectiveText: {
    flex: 1,
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
});
