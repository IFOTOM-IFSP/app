import { InteractiveCard } from "@/src/components/common/InteractiveCard";
import {
  BorderRadius,
  FontSize,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface BarData {
  label: string;
  value: number;
}

interface BarComparisonProps {
  title: string;
  description?: string;
  bars: BarData[];
}

export function BarComparison({
  title,
  description,
  bars,
}: BarComparisonProps) {
  const { width } = useWindowDimensions();

  const cardBgColor = useThemeValue("card");
  const chartLineColor = useThemeValue("primary");
  const chartLabelColor = useThemeValue("textSecondary");

  const chartConfig = {
    backgroundGradientFrom: cardBgColor,
    backgroundGradientTo: cardBgColor,
    color: (opacity = 1) =>
      `${chartLineColor}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
    labelColor: () => chartLabelColor,
    propsForVerticalLabels: {
      fontSize: FontSize.xs,
    },
    decimalPlaces: 0,
    barPercentage: 0.7,
  };

  const chartData = {
    labels: bars.map((bar) => bar.label),
    datasets: [{ data: bars.map((bar) => bar.value) }],
  };

  return (
    <InteractiveCard title={title} description={description}>
      <BarChart
        data={chartData}
        width={width - Padding.xxl * 2}
        height={200}
        chartConfig={chartConfig}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        showValuesOnTopOfBars
        style={styles.chart}
      />
    </InteractiveCard>
  );
}

const styles = StyleSheet.create({
  chart: {
    borderRadius: BorderRadius.md,

    marginLeft: -Margin.lg,
  },
});
