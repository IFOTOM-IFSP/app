import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface InteractiveCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function InteractiveCard({
  title,
  description,
  children,
  style,
}: InteractiveCardProps) {
  const cardBg = useThemeValue("card");
  const borderColor = useThemeValue("border");
  const shadowColor = useThemeValue("shadow");
  const primaryText = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cardBg, borderColor, shadowColor },
        style,
      ]}>
      <ThemedText style={[styles.title, { color: primaryText }]}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText style={[styles.description, { color: secondaryText }]}>
          {description}
        </ThemedText>
      )}
      <View style={styles.contentArea}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Padding.xl,
    marginVertical: Margin.sm,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: "center",
    marginBottom: Margin.xs,
  },
  description: {
    fontSize: FontSize.sm,
    textAlign: "center",
    marginBottom: Margin.md,
  },
  contentArea: {},
});
