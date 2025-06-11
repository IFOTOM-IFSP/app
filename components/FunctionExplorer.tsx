import { Colors } from "@/constants/Colors";
import Slider from "@react-native-community/slider";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartContainer } from "./ChartContainer";

const theme = Colors.light;

interface InputConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}
interface OutputConfig {
  label: string;
  calculate: (value: number) => number;
}
interface ChartOptions {
  xLabel: string;
  yLabel: string;
  domain: [number, number];
}
export interface FunctionExplorerProps {
  title: string;
  description?: string;
  input: InputConfig;
  output: OutputConfig;
  chartOptions?: ChartOptions;
}

export const FunctionExplorer: React.FC<FunctionExplorerProps> = ({
  title,
  description,
  input,
  output,
  chartOptions,
}) => {
  const { width } = useWindowDimensions();
  const [sliderValue, setSliderValue] = useState(input.min);
  const outputValue = output.calculate(sliderValue);

  const chartData = useMemo(() => {
    if (!chartOptions) return null;
    const { domain } = chartOptions;
    const chartPoints = 11;
    const labels = Array.from({ length: chartPoints }, (_, i) =>
      (domain[0] + ((domain[1] - domain[0]) * i) / (chartPoints - 1)).toFixed(1)
    );
    const dataPoints = labels.map((label) => output.calculate(Number(label)));
    return { labels, datasets: [{ data: dataPoints }] };
  }, [chartOptions, output.calculate]);

  const getDotColor = (index: number): string => {
    if (!chartData) return "transparent";
    const { domain } = chartOptions!;
    const currentX = parseFloat(chartData.labels[index]);
    const stepSize = (domain[1] - domain[0]) / (chartData.labels.length - 1);
    if (Math.abs(currentX - sliderValue) < stepSize) return theme.pink;
    return "transparent";
  };

  const chartConfig = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
    propsForDots: { r: "4", strokeWidth: "2", stroke: theme.accentPurple },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}

      {chartOptions && chartData && (
        <ChartContainer
          xAxisLabel={chartOptions.xLabel}
          yAxisLabel={chartOptions.yLabel}>
          <LineChart
            data={chartData}
            width={width - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 8, marginLeft: -10 }}
            getDotColor={(_, index) => getDotColor(index)}
            withInnerLines={false}
            withOuterLines={false}
          />
        </ChartContainer>
      )}

      <View style={styles.controlContainer}>
        <Text style={styles.controlLabel}>
          {input.label}:{" "}
          <Text style={styles.valueText}>
            {sliderValue.toFixed(input.step < 1 ? 2 : 0)}
            {input.unit}
          </Text>
        </Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={input.min}
          maximumValue={input.max}
          step={input.step}
          value={sliderValue}
          onValueChange={setSliderValue}
          thumbTintColor={theme.accentPurple}
          minimumTrackTintColor={theme.accentPurple}
          maximumTrackTintColor={theme.borderColor}
        />
      </View>

      <View style={styles.outputContainer}>
        <Text style={styles.outputLabel}>{output.label}:</Text>
        <Text style={styles.outputValue}>{outputValue.toFixed(3)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: theme.borderColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: theme.textPrimary,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: theme.textSecondary,
    marginBottom: 16,
  },
  controlContainer: { marginBottom: 16, marginTop: 16 },
  controlLabel: { fontSize: 16, color: theme.textSecondary, marginBottom: 4 },
  valueText: { fontWeight: "bold", color: theme.textPrimary },
  outputContainer: {
    backgroundColor: "rgba(107, 70, 193, 0.05)",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  outputLabel: { fontSize: 16, color: theme.textSecondary },
  outputValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.accentPurple,
    marginTop: 4,
  },
});
