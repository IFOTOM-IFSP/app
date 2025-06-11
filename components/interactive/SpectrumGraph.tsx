import { ChartContainer } from "@/components/ChartContainer";
import { Colors } from "@/constants/Colors";
import React from "react";
import { useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const theme = Colors.light;

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

const chartConfig = {
  backgroundColor: theme.cardBackground,
  backgroundGradientFrom: theme.cardBackground,
  backgroundGradientTo: theme.cardBackground,
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
  style: { borderRadius: 8 },
  propsForDots: { r: "2", strokeWidth: "2", stroke: theme.accentPurple },
};

export const SpectrumGraph: React.FC<SpectrumGraphProps> = ({
  title,
  xLabel,
  yLabel,
  spectrumData,
}) => {
  const { width } = useWindowDimensions();

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
        width={width - 80}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 8, marginLeft: -10 }}
        withInnerLines={false}
      />
    </ChartContainer>
  );
};
