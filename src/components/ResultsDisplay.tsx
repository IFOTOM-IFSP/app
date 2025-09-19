import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

// Importando os tipos de dados que o componente espera receber

import { CurveGraphData } from "@/services/analysisService";
import { FinalResult } from "@/store/analysisStore";
import { AnalysisSetupFormData } from "@/models/analysis";

const screenWidth = Dimensions.get("window").width;

// Definindo as props que o componente aceita
interface ResultsDisplayProps {
  setupData: AnalysisSetupFormData;
  finalResult: FinalResult;
  graphData: CurveGraphData | null;
}

export default function ResultsDisplay({
  setupData,
  finalResult,
  graphData,
}: ResultsDisplayProps) {
  // --- Preparar dados para o gráfico ---
  // A lógica do gráfico é a mesma, mas agora usa props em vez de um store
  const chartData = {
    labels:
      graphData?.curve_line_points.map((p) => p.concentration.toFixed(2)) || [],
    datasets: [
      {
        data: graphData?.curve_line_points.map((p) => p.absorbance) || [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      // Adicionamos um dataset "fantasma" para garantir que o gráfico renderize mesmo sem pontos de calibração ou amostra
      { data: [0], withDots: false, color: () => "transparent" },
    ],
    legend: ["Curva de Calibração"],
  };

  // Adicionar os pontos de calibração (vermelhos)
  if (
    graphData?.calibration_points &&
    graphData.calibration_points.length > 0
  ) {
    // @ts-ignore - Usando a solução de estender os tipos ou @ts-ignore
    chartData.datasets.push({
      data: graphData.calibration_points.map((p) => p.absorbance),
      color: () => `rgba(255, 0, 0, 1)`,
      strokeWidth: 0, // Sem linha
      pointRadius: 5,
    });
    chartData.legend?.push("Padrões");
  }

  // Adicionar o ponto da amostra (verde)
  if (graphData?.sample_point) {
    // @ts-ignore
    chartData.datasets.push({
      data: [graphData.sample_point.absorbance],
      color: () => `rgba(0, 150, 0, 1)`,
      strokeWidth: 0,
      pointRadius: 7,
    });
    chartData.legend?.push("Amostra");
  }

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 3,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resultados da Análise</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{setupData.analysisName}</Text>
        <Text style={styles.cardSubtitle}>
          {setupData.substance} @ {setupData.wavelength} nm
        </Text>

        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Concentração Final:</Text>
          <Text style={styles.resultValue}>
            {finalResult.final_concentration.toFixed(4)}
          </Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Absorbância Média:</Text>
          <Text style={styles.resultValue}>
            {finalResult.mean_absorbance.toFixed(4)}
          </Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Desvio Padrão:</Text>
          <Text style={styles.resultValue}>
            {finalResult.std_dev.toFixed(4)}
          </Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Coef. de Variação (%):</Text>
          <Text style={styles.resultValue}>
            {finalResult.coefficient_of_variation.toFixed(4)}
          </Text>
        </View>
      </View>

      {graphData && (
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Curva de Calibração e Amostra</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={250}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
            yAxisLabel="Abs "
          />
        </View>
      )}
    </ScrollView>
  );
}

// Os estilos são os mesmos da tela de resultados original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2d3748",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#4a5568",
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  resultLabel: {
    fontSize: 16,
    color: "#4a5568",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
  },
  graphContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 3,
    alignItems: "center",
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
