import { InteractiveCard } from "@/components/InteractiveCard";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const theme = Colors.light;

interface BarData {
  label: string;
  value: number;
}

interface BarComparisonProps {
  title: string;
  description?: string;
  bars: BarData[];
}

const chartConfig = {
  backgroundGradientFrom: theme.cardBackground,
  backgroundGradientTo: theme.cardBackground,
  color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
  labelColor: (opacity = 1) => theme.textSecondary,
  propsForVerticalLabels: {
    fontSize: "10",
  },
  decimalPlaces: 0,
  barPercentage: 0.7,
};

export const BarComparison: React.FC<BarComparisonProps> = ({
  title,
  description,
  bars,
}) => {
  const { width } = useWindowDimensions();

  const chartData = {
    labels: bars.map((bar: BarData) => bar.label),
    datasets: [{ data: bars.map((bar: BarData) => bar.value) }],
  };

  return (
    <InteractiveCard title={title} description={description}>
      <BarChart
        data={chartData}
        width={width - 60}
        height={250}
        chartConfig={chartConfig}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        showValuesOnTopOfBars
        style={styles.chart}
      />
    </InteractiveCard>
  );
};

const styles = StyleSheet.create({
  chart: {
    borderRadius: 8,
    marginLeft: -15,
  },
});
