import QuantitativeFormsScreen from "@/src/components/analysis/screenForms/QuantitativeConfig";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const analysisFormMap = {
  quantitative: QuantitativeFormsScreen,
  // scan: SpectralScanConfig,
  // kinetic: KineticAnalysisConfig,
};

export default function AnalysisConfigurationScreen() {
  const { analysisFormId } = useLocalSearchParams<{ analysisFormId: string }>();

  const AnalysisFormComponent = analysisFormId
    ? analysisFormMap[analysisFormId as keyof typeof analysisFormMap]
    : null;

  return (
    <ScreenLayout>
      {AnalysisFormComponent ? (
        <AnalysisFormComponent />
      ) : (
        <ThemedText>
          Erro: Tipo de análise '{String(analysisFormId)}' desconhecido.
        </ThemedText>
      )}
    </ScreenLayout>
  );
}
