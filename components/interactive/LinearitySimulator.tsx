import { ChartContainer } from "@/components/ChartContainer";
import { Colors } from "@/constants/Colors";
import { Point, useLinearRegression } from "@/hooks/useLinearRegression";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const theme = Colors.light;

interface LinearitySimulatorProps {
  title: string;
  description?: string;
  initialData: Point[];
  xLabel?: string;
  yLabel?: string;
}

export const LinearitySimulator: React.FC<LinearitySimulatorProps> = ({
  title,
  description,
  initialData,
  xLabel = "Concentração",
  yLabel = "Absorbância",
}) => {
  const { width } = useWindowDimensions();
  const [points, setPoints] = useState<Point[]>(initialData);
  const regression = useLinearRegression(points);

  const addOutlier = () => {
    const maxX = points.length > 0 ? Math.max(...points.map((p) => p.x)) : 1;
    const maxY = points.length > 0 ? Math.max(...points.map((p) => p.y)) : 1;
    const newX = Math.random() * maxX;
    const newY = maxY * (1.5 + Math.random() * 0.5);
    setPoints((prev) => [...prev, { x: newX, y: newY }]);
  };

  const reset = () => {
    setPoints(initialData);
  };

  const combinedChartData = {
    labels: [],
    datasets: [
      {
        data: points.map((p) => p.y),
        withDots: true,
        color: () => "transparent",
        strokeWidth: 0,
      },
      {
        data: regression.linePoints.length
          ? regression.linePoints.map((p) => p.y)
          : [0],
        withDots: false,
        color: () => "#FF6384",
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    color: (opacity = 1) => theme.accentPurple,
    propsForBackgroundLines: { stroke: theme.borderColor },
    decimalPlaces: 2,
  };

  return (
    <View>
      <ChartContainer
        title={title}
        description={description}
        xAxisLabel={xLabel}
        yAxisLabel={yLabel}>
        <LineChart
          data={combinedChartData}
          width={width - 80}
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={{ borderRadius: 8, marginLeft: -20 }}
          renderDotContent={({ x, y, index, indexData }) => (
            <View
              key={index}
              style={{
                position: "absolute",
                left: x - 4,
                top: y - 4,
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: theme.accentPurple,
              }}
            />
          )}
        />
      </ChartContainer>

      <View style={styles.controlsContainer}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            R² ={" "}
            <Text style={styles.resultValue}>{regression.r2.toFixed(4)}</Text>
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Adicionar Outlier"
            onPress={addOutlier}
            color={theme.accentPurple}
          />
          <View style={{ width: 16 }} />
          <Button title="Resetar" onPress={reset} color={theme.textSecondary} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    paddingHorizontal: 16,
  },
  resultContainer: {
    paddingVertical: 12,
    backgroundColor: "rgba(107, 70, 193, 0.05)",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  resultText: { fontSize: 16, color: theme.textPrimary },
  resultValue: { fontWeight: "bold", fontSize: 18, color: theme.accentPurple },
  buttonContainer: { flexDirection: "row", justifyContent: "center" },
});
