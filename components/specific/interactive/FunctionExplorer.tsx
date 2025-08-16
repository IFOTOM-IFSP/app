import { ChartContainer } from "@/components/specific/interactive/ChartContainer";
import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import Slider from "@react-native-community/slider";
import React, { useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

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

export function FunctionExplorer({
  title,
  description,
  input,
  output,
  chartOptions,
}: FunctionExplorerProps) {
  const { width } = useWindowDimensions();
  const [sliderValue, setSliderValue] = useState(input.min);
  const outputValue = output.calculate(sliderValue);

  const primaryText = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");
  const pinkColor = useThemeValue("pink");
  const borderColor = useThemeValue("border");
  const cardBg = useThemeValue("card");
  const outputBg = useThemeValue("card");
  const chartLineColor = useThemeValue("tint");

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
    if (!chartData || !chartOptions) return "transparent";
    const { domain } = chartOptions;
    const chartStep =
      (domain[1] - domain[0]) / (chartData.datasets[0].data.length - 1);
    const currentX = domain[0] + index * chartStep;

    if (Math.abs(currentX - sliderValue) < chartStep / 2) return pinkColor;
    return "transparent";
  };

  const chartConfig = {
    backgroundColor: cardBg,
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    decimalPlaces: 2,
    color: (opacity = 1) =>
      `${secondaryText}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
    labelColor: () => secondaryText,
    propsForDots: { r: "4", strokeWidth: "2", stroke: accentColor },
  };

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <ThemedText style={[styles.title, { color: primaryText }]}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText style={[styles.description, { color: secondaryText }]}>
          {description}
        </ThemedText>
      )}

      {chartOptions && chartData && (
        <ChartContainer
          xAxisLabel={chartOptions.xLabel}
          yAxisLabel={chartOptions.yLabel}>
          <LineChart
            data={chartData}
            width={width - Padding.lg * 2 - Padding.md * 2}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: BorderRadius.md, marginLeft: -Margin.md }}
            getDotColor={(_, index) => getDotColor(index)}
            withInnerLines={false}
            withOuterLines={false}
          />
        </ChartContainer>
      )}

      <View style={styles.controlContainer}>
        <ThemedText style={[styles.controlLabel, { color: secondaryText }]}>
          {input.label}:{" "}
          <ThemedText style={[styles.valueText, { color: primaryText }]}>
            {sliderValue.toFixed(input.step < 1 ? 2 : 0)}
            {input.unit}
          </ThemedText>
        </ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={input.min}
          maximumValue={input.max}
          step={input.step}
          value={sliderValue}
          onValueChange={setSliderValue}
          thumbTintColor={accentColor}
          minimumTrackTintColor={accentColor}
          maximumTrackTintColor={borderColor}
        />
      </View>

      <View style={[styles.outputContainer, { backgroundColor: outputBg }]}>
        <ThemedText style={[styles.outputLabel, { color: secondaryText }]}>
          {output.label}:
        </ThemedText>
        <ThemedText style={[styles.outputValue, { color: accentColor }]}>
          {outputValue.toFixed(3)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Padding.md,
    marginVertical: Margin.md,
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
  controlContainer: {
    marginBottom: Margin.md,
    marginTop: Margin.md,
  },
  controlLabel: {
    fontSize: FontSize.md,
    marginBottom: Margin.xs,
  },
  valueText: {
    fontWeight: FontWeight.bold,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  outputContainer: {
    borderRadius: BorderRadius.md,
    padding: Padding.md,
    alignItems: "center",
    justifyContent: "center",
  },
  outputLabel: {
    fontSize: FontSize.md,
  },
  outputValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginTop: Margin.xs,
  },
});
