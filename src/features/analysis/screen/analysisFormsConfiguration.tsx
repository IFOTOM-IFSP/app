import QuantitativeConfig from "@/src/components/configuration/QuantitativeConfig";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const analysisTypeMap = {
  quantitative: QuantitativeConfig,
};

export default function AnalysisFormsConfigurationScreen() {
  const { analysisType } = useLocalSearchParams<{ analysisType: string }>();
  const AnalysisComponent =
    analysisTypeMap[analysisType as keyof typeof analysisTypeMap];

  return (
    <ScreenLayout>
      <View style={styles.container}>
        {AnalysisComponent ? (
          <AnalysisComponent />
        ) : (
          <ThemedText>
            Erro: Tipo de análise '{String(analysisType)}' desconhecido.
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
