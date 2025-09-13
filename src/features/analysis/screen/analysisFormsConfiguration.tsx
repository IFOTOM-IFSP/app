import QuantitativeConfig from "@/src/components/configuration/QuantitativeConfig";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const analysisFormMap = {
  quantitative: QuantitativeConfig,
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
      <View style={styles.container}>
        {AnalysisFormComponent ? (
          <AnalysisFormComponent />
        ) : (
          <ThemedText>
            Erro: Tipo de análise '{String(analysisFormId)}' desconhecido.
          </ThemedText>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
