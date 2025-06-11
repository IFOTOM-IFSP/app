import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

type ChartData = {
  area: string;
  impacto: number;
};

type ImpactoSetorialChartProps = {
  data: ChartData[];
  unit: string;
  description: string;
};

const ImpactoSetorialChart: React.FC<ImpactoSetorialChartProps> = ({
  data,
  unit,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.chart}>
        {data.map((item) => (
          <View key={item.area} style={styles.barContainer}>
            <Text style={styles.areaLabel}>{item.area}</Text>
            <View style={styles.barWrapper}>
              <View style={[styles.bar, { width: `${item.impacto}%` }]} />
              <Text style={styles.barLabel}>
                {item.impacto}
                {unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    marginVertical: 16,
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  chart: {
    width: "100%",
  },
  barContainer: {
    marginBottom: 12,
  },
  areaLabel: {
    fontSize: 14,
    color: theme.textPrimary,
    marginBottom: 4,
    fontWeight: "500",
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.borderColor,
    borderRadius: 6,
    height: 28,
  },
  bar: {
    height: "100%",
    backgroundColor: theme.accentPurple,
    borderRadius: 6,
  },
  barLabel: {
    position: "absolute",
    right: 8,
    fontSize: 12,
    fontWeight: "bold",
    color: theme.buttonText,
  },
});

export default ImpactoSetorialChart;
