import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ThemedText } from "@/src/components/ui/ThemedText";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface FormSectionProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export function FormSection({ title, children, style }: FormSectionProps) {
  const cardBackgroundColor = useThemeValue("card");
  const borderColor = useThemeValue("border");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cardBackgroundColor, borderColor },
        style,
      ]}>
      {title && <ThemedText style={styles.title}>{title}</ThemedText>}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Padding.md,
    paddingTop: Padding.lg,
    width: "100%",
    paddingBottom: Padding.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
  },
  content: {
    gap: Spacing.md,
  },
});
