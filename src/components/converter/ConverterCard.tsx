import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import React from "react";
import { StyleSheet } from "react-native";

interface ConverterCardProps {
  title: string;
  children: React.ReactNode;
}

export function ConverterCard({ title, children }: ConverterCardProps) {
  const cardBg = useThemeValue("card");
  const primaryText = useThemeValue("text");
  const borderColor = useThemeValue("border");
  const shadowColor = useThemeValue("shadow");

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: cardBg, borderColor, shadowColor },
      ]}>
      <ThemedText
        style={[
          styles.cardTitle,
          { color: primaryText, borderBottomColor: borderColor },
        ]}>
        {title}
      </ThemedText>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Padding.xl,
    marginBottom: Margin.xl,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.xl,
    borderBottomWidth: 1,
    paddingBottom: Padding.md,
  },
});
