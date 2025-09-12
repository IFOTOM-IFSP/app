import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';

declare module 'react-native-chart-kit' {
  interface ChartData extends LineChartData {
    pointRadius?: number;
    pointColor?: (opacity?: number) => string;
    pointLabel?: string[];
  }
}