import { ChartContainer } from "@/components/specific/interactive/ChartContainer";
import { BorderRadius, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface SpectrumData {
  wavelengths: number[];
  absorbances: number[];
}
interface SpectrumGraphProps {
  title?: string;
  xLabel: string;
  yLabel: string;
  spectrumData: SpectrumData;
}

export function SpectrumGraph({
  title,
  xLabel,
  yLabel,
  spectrumData,
}: SpectrumGraphProps) {
  const { width } = useWindowDimensions();

  const cardBg = useThemeValue("cardBackground");
  const accentColor = useThemeValue("accentPurple");
  const secondaryText = useThemeValue("textSecondary");
  const chartLineColor = useThemeValue("tint");

  const chartConfig = {
    backgroundColor: cardBg,
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    decimalPlaces: 2,
    color: (opacity = 1) =>
      `${chartLineColor}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
    labelColor: () => secondaryText,
    style: {
      borderRadius: BorderRadius.md,
    },
    propsForDots: {
      r: "2",
      strokeWidth: "2",
      stroke: accentColor,
    },
  };

  const chartData = {
    labels: spectrumData.wavelengths.map((wl: number, index: number) =>
      index % 5 === 0 ? String(wl) : ""
    ),
    datasets: [{ data: spectrumData.absorbances, strokeWidth: 2 }],
  };

  return (
    <ChartContainer title={title} xAxisLabel={xLabel} yAxisLabel={yLabel}>
      <LineChart
        data={chartData}
        width={width - Padding.lg * 2 - Padding.md * 2}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: BorderRadius.md,
        }}
        withInnerLines={false}
      />
    </ChartContainer>
  );
}
