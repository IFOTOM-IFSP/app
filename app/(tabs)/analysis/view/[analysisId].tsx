import ResultsDisplay from "@/src/components/ResultsDisplay";
import { useHistoryStore } from "@/store/historyStore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedAnalysis, status, loadSingleReport } = useHistoryStore();

  useEffect(() => {
    if (id) {
      loadSingleReport(id);
    }
  }, [id]);

  if (status === "loading" || !selectedAnalysis) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (status === "error") {
    return (
      <View>
        <Text>Erro ao carregar a análise.</Text>
      </View>
    );
  }

  return (
    <ResultsDisplay
      setupData={selectedAnalysis.setupData}
      finalResult={selectedAnalysis.finalResult}
      graphData={selectedAnalysis.graphData}
    />
  );
}
