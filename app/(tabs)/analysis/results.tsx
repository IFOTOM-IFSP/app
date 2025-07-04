// Localização: src/app/analysis/results.tsx

import { useAnalysisStore } from "@/state/analysisStore";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

// Componentes, Ícones e Tipos
import { FormSection } from "@/components/ui/FormSection";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { AnalysisSetup } from "@/interfaces/analysis";
import { ApiAnalysisResult } from "@/schema/apiSchema";
import { Beaker, CheckCircle, Home, ScanLine } from "lucide-react-native";

// --- COMPONENTE PRINCIPAL DA TELA DE RESULTADOS ---

export default function ResultsScreen() {
  const router = useRouter();
  const { sessionData, actions } = useAnalysisStore();
  const { setup, result } = sessionData;

  const accentColor = useThemeValue("primary");
  const borderColor = useThemeValue("border");

  const handleFinish = () => {
    actions.resetAnalysis();
    router.replace("/(tabs)/"); // Navega para a tela inicial
  };

  const renderResults = () => {
    if (!setup || !result) {
      return <ActivityIndicator style={{ marginTop: Margin.xl }} />;
    }

    switch (setup.analysisType) {
      case "quantitative":
        return <QuantitativeResults setup={setup} result={result} />;
      case "scan":
        return <ScanResults setup={setup} result={result} />;
      case "kinetic":
        return <KineticResults setup={setup} result={result} />;
      case "simple_read":
        return <SimpleReadResults setup={setup} result={result} />;
      default:
        return <ThemedText>Tipo de resultado não suportado.</ThemedText>;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <CheckCircle size={64} strokeWidth={1.5} color={accentColor} />
          <ThemedText style={styles.title}>Análise Concluída</ThemedText>
          <ThemedText style={styles.subtitle}>{setup?.analysisName}</ThemedText>
        </View>
        {renderResults()}
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: borderColor }]}>
        <PrimaryButton
          title="Finalizar e Voltar ao Início"
          onPress={handleFinish}
          icon={<Home size={20} color="white" />}
        />
      </View>
    </ThemedView>
  );
}

// --- SUB-COMPONENTES PARA CADA TIPO DE RESULTADO ---

interface ResultsProps {
  setup: AnalysisSetup;
  result: ApiAnalysisResult;
}

const QuantitativeResults = ({ setup, result }: ResultsProps) => {
  return (
    <>
      {result.calibration_curve && (
        <FormSection title="Curva de Calibração">
          <InfoRow
            label="Equação da Reta"
            value={result.calibration_curve.equation}
          />
          <InfoRow
            label="Coeficiente de Correlação (R²)"
            value={result.calibration_curve.r_squared.toFixed(4)}
          />
        </FormSection>
      )}
      <FormSection title="Resultados da Amostra">
        {result.sample_results.map((sample, index) => (
          <View key={index} style={styles.resultCard}>
            <Beaker size={24} color={"purlple"} />
            <View style={styles.resultTextContainer}>
              <ThemedText style={styles.resultLabel}>
                Amostra {index + 1}
              </ThemedText>
              <ThemedText style={styles.resultValue}>
                {sample.calculated_concentration?.toFixed(4) ?? "N/A"}{" "}
                {setup.unit}
              </ThemedText>
              <ThemedText style={styles.resultMeta}>
                Absorbância: {sample.sample_absorbance?.toFixed(4) ?? "N/A"}
              </ThemedText>
            </View>
          </View>
        ))}
      </FormSection>
    </>
  );
};

const ScanResults = ({ setup, result }: ResultsProps) => {
  const peakAbs = result.sample_results[0]?.sample_absorbance;
  const spectrumData = result.sample_results[0]?.spectrum_data || [];
  const peakWavelength =
    peakAbs && spectrumData.length > 0
      ? spectrumData.find((d) => d[1] === peakAbs)?.[0]
      : null;

  return (
    <>
      <FormSection title="Pico de Absorbância">
        <InfoRow
          label="λ Máximo"
          value={peakWavelength ? `${peakWavelength.toFixed(1)} nm` : "N/A"}
        />
        <InfoRow
          label="Absorbância no Pico"
          value={peakAbs ? peakAbs.toFixed(4) : "N/A"}
        />
      </FormSection>
      <FormSection title="Espectro de Absorção">
        <SpectrumChart
          data={spectrumData}
          xLabel="Comprimento de Onda (nm)"
          yLabel="Absorbância"
        />
      </FormSection>
    </>
  );
};

const KineticResults = ({ setup, result }: ResultsProps) => {
  const kineticData = result.sample_results[0]?.kinetic_data || [];
  return (
    <FormSection title="Análise Cinética">
      <SpectrumChart
        data={kineticData}
        xLabel="Tempo (s)"
        yLabel="Absorbância"
      />
    </FormSection>
  );
};

const SimpleReadResults = ({ setup, result }: ResultsProps) => {
  const absorbance = result.sample_results[0]?.sample_absorbance;
  return (
    <FormSection title="Leitura Simples">
      <InfoRow
        label={`Absorbância em ${setup.targetWavelength} nm`}
        value={absorbance ? absorbance.toFixed(4) : "N/A"}
      />
    </FormSection>
  );
};

// --- COMPONENTES DE UI REUTILIZÁVEIS PARA ESTA TELA ---

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    <ThemedText style={styles.infoValue}>{value}</ThemedText>
  </View>
);

// Componente de placeholder para o gráfico
const SpectrumChart = ({ data, xLabel, yLabel }: any) => {
  const borderColor = useThemeValue("border");
  const textSecondaryColor = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");

  return (
    <View style={[styles.chartContainer, { borderColor }]}>
      <ThemedText
        style={[styles.axisLabel, { transform: [{ rotate: "-90deg" }] }]}>
        {yLabel}
      </ThemedText>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ScanLine size={64} color={accentColor} strokeWidth={1} />
        <ThemedText style={{ color: textSecondaryColor, marginTop: Margin.md }}>
          Gráfico de {yLabel} vs. {xLabel}
        </ThemedText>
      </View>
      <ThemedText style={[styles.axisLabel, { textAlign: "center" }]}>
        {xLabel}
      </ThemedText>
    </View>
  );
};

// --- ESTILOS ---

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Padding.lg },
  header: {
    alignItems: "center",
    marginBottom: Margin.xl,
    paddingTop: Padding.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginTop: Margin.md,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: "#888",
    marginTop: Spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Padding.md,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: FontSize.md,
    color: "#666",
  },
  infoValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Padding.md,
  },
  resultTextContainer: {
    marginLeft: Margin.md,
  },
  resultLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  resultValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: "#444",
    marginTop: Spacing.xs,
  },
  resultMeta: {
    fontSize: FontSize.sm,
    color: "#888",
    marginTop: Spacing.xs,
  },
  chartContainer: {
    height: 250,
    borderWidth: 1,
    borderRadius: 8,
    padding: Padding.md,
    flexDirection: "row",
    alignItems: "center",
  },
  axisLabel: {
    color: "#aaa",
    fontSize: FontSize.xs,
  },
  footer: {
    padding: Padding.lg,
    borderTopWidth: 1,
  },
});
