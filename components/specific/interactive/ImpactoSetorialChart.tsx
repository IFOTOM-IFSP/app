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

type ChartData = {
  area: string;
  impacto: number;
};

type ImpactoSetorialChartProps = {
  data: ChartData[];
  unit: string;
  description: string;
};

export function ImpactoSetorialChart({
  data,
  unit,
  description,
}: ImpactoSetorialChartProps) {
  const cardBg = useThemeValue("card");
  const borderColor = useThemeValue("border");
  const textSecondary = useThemeValue("textSecondary");
  const textPrimary = useThemeValue("text");
  const barBg = useThemeValue("border");
  const barColor = useThemeValue("primary");
  const barTextColor = useThemeValue("buttonText");

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <ThemedText style={[styles.description, { color: textSecondary }]}>
        {description}
      </ThemedText>
      <View style={styles.chart}>
        {data.map((item) => (
          <View
            key={item.area}
            style={styles.barContainer}
            accessibilityLabel={`${item.area}: ${item.impacto}${unit}`}
            accessibilityRole="text"
            accessibilityHint="Barra de progresso">
            <ThemedText style={[styles.areaLabel, { color: textPrimary }]}>
              {item.area}
            </ThemedText>
            <View style={[styles.barWrapper, { backgroundColor: barBg }]}>
              <View
                style={[
                  styles.bar,
                  { width: `${item.impacto}%`, backgroundColor: barColor },
                ]}
              />
              <ThemedText style={[styles.barLabel, { color: barTextColor }]}>
                {item.impacto}
                {unit}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    marginVertical: Margin.md,
    borderWidth: 1,
  },
  description: {
    fontSize: FontSize.sm,
    textAlign: "center",
    marginBottom: Margin.md,
    fontStyle: "italic",
  },
  chart: {
    width: "100%",
  },
  barContainer: {
    marginBottom: Margin.sm,
  },
  areaLabel: {
    fontSize: FontSize.sm,
    marginBottom: Margin.xs,
    fontWeight: FontWeight.medium,
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    height: 28,
  },
  bar: {
    height: "100%",
    borderRadius: BorderRadius.sm,
  },
  barLabel: {
    position: "absolute",
    right: Padding.sm,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
