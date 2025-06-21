import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ChartContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export function ChartContainer({
  title,
  children,
  description,
  xAxisLabel,
  yAxisLabel,
}: ChartContainerProps) {
  const cardBg = useThemeValue("cardBackground");
  const borderColor = useThemeValue("borderColor");
  const primaryText = useThemeValue("textPrimary");
  const secondaryText = useThemeValue("textSecondary");

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      {title && (
        <ThemedText style={[styles.title, { color: primaryText }]}>
          {title}
        </ThemedText>
      )}
      {description && (
        <ThemedText style={[styles.description, { color: secondaryText }]}>
          {description}
        </ThemedText>
      )}

      <View style={styles.chartWrapper}>
        {yAxisLabel && (
          <ThemedText
            style={[
              styles.axisLabel,
              styles.yAxisLabel,
              { color: secondaryText },
            ]}>
            {yAxisLabel}
          </ThemedText>
        )}
        {children}
        {xAxisLabel && (
          <ThemedText
            style={[
              styles.axisLabel,
              styles.xAxisLabel,
              { color: secondaryText },
            ]}>
            {xAxisLabel}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Margin.md,
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.lg,
    textAlign: "center",
  },
  description: {
    fontSize: FontSize.sm,
    textAlign: "center",
    marginBottom: Margin.md,
  },
  chartWrapper: {
    alignItems: "center",
    position: "relative",
    marginHorizontal: -Padding.lg,
  },
  axisLabel: {
    position: "absolute",
    fontSize: FontSize.xs,
  },
  xAxisLabel: {
    bottom: -Padding.md,
  },
  yAxisLabel: {
    left: -Padding.lg,
    top: "50%",
    transform: [{ rotate: "-90deg" }],
  },
});
