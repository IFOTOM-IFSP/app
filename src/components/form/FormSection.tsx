import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface FormSectionProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "compact";
}

export function FormSection({
  title,
  children,
  style,
  variant = "default",
}: FormSectionProps) {
  const cardBackgroundColor = useThemeValue("card");
  const borderColor = useThemeValue("border");

  const containerStyle =
    variant === "compact" ? styles.containerCompact : styles.containerDefault;

  return (
    <View
      style={[
        containerStyle,
        { backgroundColor: cardBackgroundColor, borderColor },
        style,
      ]}>
      {title && <ThemedText style={styles.title}>{title}</ThemedText>}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerDefault: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Padding.lg,
    marginBottom: Margin.lg,
  },
  containerCompact: {
    borderWidth: 0.3,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Padding.md,
    paddingTop: Padding.lg,
    width: "100%",
    paddingBottom: Padding.md,
    marginBottom: Margin.lg,
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
