import { useAnalysisStore } from "@/store/analysisStore";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function ResultsScreen() {
  const { finalResult, graphData, setupData, resetAnalysis } =
    useAnalysisStore();

  useEffect(() => {
    // Se não houver resultado final, redireciona para o início da análise
    if (!finalResult) {
      Alert.alert(
        "Erro",
        "Nenhum resultado de análise encontrado. Inicie uma nova análise."
      );
      router.replace("/(tabs)/quantitative"); // Ou para a tela de setup
    }
  }, [finalResult]);

  const handleNewAnalysis = () => {
    resetAnalysis(); // Limpa o store para uma nova análise
    router.replace("/(tabs)/quantitative");
  };

  if (!finalResult || !setupData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando resultados...</Text>
        <Button title="Iniciar Nova Análise" onPress={handleNewAnalysis} />
      </View>
    );
  }

  // --- Preparar dados para o gráfico ---
  // Os dados da API já vêm no formato ideal. Precisamos apenas mapeá-los para o chart-kit.
  const chartData = {
    labels:
      graphData?.curve_line_points.map((p) => p.concentration.toFixed(2)) || [], // Eixo X
    datasets: [
      {
        data: graphData?.curve_line_points.map((p) => p.absorbance) || [], // Linha da curva
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Cor da linha
        strokeWidth: 2, // Espessura da linha
      },
    ],
  };

  // Adicionar os pontos de calibração se existirem (como pontos separados)
  if (
    graphData?.calibration_points &&
    graphData.calibration_points.length > 0
  ) {
    chartData.datasets.push({
      data: graphData.calibration_points.map((p) => p.absorbance),
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Cor vermelha para pontos de calibração
      pointStyle: "circle",
      pointRadius: 6,

      pointColor: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      pointLabel: graphData.calibration_points.map(
        (p) =>
          `C: ${p.concentration.toFixed(2)}\nAbs: ${p.absorbance.toFixed(3)}`
      ),
      // @ts-ignore - chart-kit expects data point labels for some types
      withCustomBarColorFromData: true, // Necessário para exibir tooltips personalizados se houver
    });
  }

  // Adicionar o ponto da amostra se existir
  if (graphData?.sample_point) {
    chartData.datasets.push({
      data: [graphData.sample_point.absorbance],
      color: (opacity = 1) => `rgba(0, 150, 0, ${opacity})`, // Cor verde para a amostra
      strokeWidth: 0,
      pointRadius: [8, 4] as number[],
      pointColor: (opacity = 1) => `rgba(0, 150, 0, ${opacity})`,
      pointLabel: [
        `Amostra:\nC: ${graphData.sample_point.concentration.toFixed(
          2
        )}\nAbs: ${graphData.sample_point.absorbance.toFixed(3)}`,
      ],
      // @ts-ignore
      withCustomBarColorFromData: true,
    });
  }

  // Configurações gerais do gráfico
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 3, // Opcional, para o eixo Y
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor dos labels e eixos
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
    // Você pode personalizar mais as legendas e tooltips
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
          <Text style={styles.resultLabel}>Coef. de Variação:</Text>
          <Text style={styles.resultValue}>
            {finalResult.coefficient_of_variation.toFixed(4)}%
          </Text>
        </View>
      </View>

      {graphData && (
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Curva de Calibração e Amostra</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 40} // Dimensões ajustadas à tela
            height={220}
            chartConfig={chartConfig}
            bezier // Para suavizar a linha
            style={styles.chartStyle}
            formatXLabel={(label) => parseFloat(label).toFixed(2)} // Formata os rótulos do eixo X
            yAxisLabel="" // Remover se não precisar
            xLabelsOffset={-10} // Ajusta a posição dos rótulos X
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Iniciar Nova Análise" onPress={handleNewAnalysis} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center", // Centraliza o gráfico
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
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
});
