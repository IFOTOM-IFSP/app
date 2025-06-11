import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

interface ChartContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  description,
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}

      <View style={styles.chartWrapper}>
        {yAxisLabel && (
          <Text style={[styles.axisLabel, styles.yAxisLabel]}>
            {yAxisLabel}
          </Text>
        )}
        {children}
        {xAxisLabel && (
          <Text style={[styles.axisLabel, styles.xAxisLabel]}>
            {xAxisLabel}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: theme.textPrimary,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: theme.textSecondary,
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: "center",
    position: "relative",
  },
  axisLabel: {
    position: "absolute",
    fontSize: 12,
    color: theme.textSecondary,
  },
  xAxisLabel: {
    bottom: -15,
    alignSelf: "center",
  },
  yAxisLabel: {
    left: -25,
    top: "50%",
    transform: [{ rotate: "-90deg" }],
  },
});
