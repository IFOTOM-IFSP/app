import { ChartContainer } from "@/src/components/interactive/ChartContainer";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { Point, useLinearRegression } from "@/src/hooks/useLinearRegression";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface LinearitySimulatorProps {
  title: string;
  description?: string;
  initialData: Point[];
  xLabel?: string;
  yLabel?: string;
}

export function LinearitySimulator({
  title,
  description,
  initialData,
  xLabel = "Concentração",
  yLabel = "Absorbância",
}: LinearitySimulatorProps) {
  const { width } = useWindowDimensions();
  const [points, setPoints] = useState<Point[]>(initialData);
  const regression = useLinearRegression(points);

  const cardBg = useThemeValue("card");
  const primaryText = useThemeValue("text");
  const accentColor = useThemeValue("primary");
  const dangerColor = useThemeValue("dangerBackground");
  const secondaryText = useThemeValue("textSecondary");
  const borderColor = useThemeValue("border");

  const chartConfig = {
    backgroundColor: cardBg,
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    color: (opacity = 1) =>
      `${secondaryText}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
    propsForBackgroundLines: { stroke: borderColor, strokeDasharray: "" },
    decimalPlaces: 2,
  };

  const addOutlier = () => {
    const maxX = points.length > 0 ? Math.max(...points.map((p) => p.x)) : 1;
    const maxY = points.length > 0 ? Math.max(...points.map((p) => p.y)) : 1;
    const newX = Math.random() * maxX;
    const newY = maxY * (1.5 + Math.random() * 0.5);
    setPoints((prev) => [...prev, { x: newX, y: newY }]);
  };
  const reset = () => setPoints(initialData);

  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  const chartData = {
    labels: sortedPoints.map((p, i) => (i % 3 === 0 ? p.x.toFixed(2) : "")),
    datasets: [
      {
        data: sortedPoints.map((p) => p.y),
        color: () => `transparent`,
        strokeWidth: 0,
        withDots: true,
      },
      {
        data: sortedPoints.map(
          (p) => regression.slope * p.x + regression.intercept
        ),
        color: () => dangerColor,
        strokeWidth: 2,
        withDots: false,
      },
    ],
  };

  return (
    <View>
      <ChartContainer
        title={title}
        description={description}
        xAxisLabel={xLabel}
        yAxisLabel={yLabel}>
        <LineChart
          data={chartData}
          width={width - Padding.lg * 2 - Padding.md * 2}
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={{ borderRadius: BorderRadius.md }}
          renderDotContent={({ x, y, index }) => (
            <View
              key={index}
              style={[
                styles.dot,
                { left: x - 4, top: y - 4, backgroundColor: accentColor },
              ]}
            />
          )}
        />
      </ChartContainer>

      <View style={styles.controlsContainer}>
        <View
          style={[
            styles.resultContainer,
            { backgroundColor: useThemeValue("card") },
          ]}>
          <ThemedText style={[styles.resultText, { color: primaryText }]}>
            R² ={" "}
            <ThemedText style={[styles.resultValue, { color: accentColor }]}>
              {regression.r2.toFixed(4)}
            </ThemedText>
          </ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Adicionar Outlier"
            onPress={addOutlier}
            style={{ flex: 1 }}
          />
          <Button
            title="Resetar"
            onPress={reset}
            variant="outline"
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    paddingHorizontal: Padding.md,
    marginTop: Margin.md, // Adicionado para espaçamento
  },
  resultContainer: {
    paddingVertical: Padding.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginBottom: Margin.md,
  },
  resultText: {
    fontSize: FontSize.md,
  },
  resultValue: {
    fontWeight: FontWeight.bold,
    fontSize: FontSize.lg,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.md,
  },
  dot: {
    position: "absolute",
    height: 8,
    width: 8,
    borderRadius: BorderRadius.full,
  },
});
