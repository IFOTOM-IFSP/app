import QuantitativeFormsScreen from "@/src/components/analysis/screenForms/QuantitativeConfig";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

const analysisFormMap = {
  quantitative: QuantitativeFormsScreen,
  // scan: SpectralScanConfig,
  // kinetic: KineticAnalysisConfig,
};

const redirectMap: Record<string, string> = {
  calibrate: "/(tabs)/analysis/create/calibrate",
  baseline: "/(tabs)/analysis/create/baseline",
  measure: "/(tabs)/analysis/create/measure",
  "build-curve": "/(tabs)/analysis/create/build-curve",
};

export default function AnalysisConfigurationScreen() {
  const { analysisFormId: rawAnalysisFormId } =
    useLocalSearchParams<{ analysisFormId?: string | string[] }>();
  const analysisFormId = Array.isArray(rawAnalysisFormId)
    ? rawAnalysisFormId[0]
    : rawAnalysisFormId;

  const redirectPath = analysisFormId
    ? redirectMap[analysisFormId as keyof typeof redirectMap]
    : undefined;

  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [redirectPath]);

  if (redirectPath) {
    return null;
  }

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
