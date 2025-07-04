// Localização: src/app/analysis/index.tsx (ou onde for o seu hub de análise)

import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { AnalysisHistoryItem } from "@/components/specific/analysis/AnalysisHistoryItem";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { getAnalysisHistory, SavedAnalysis } from "@/storage/analysisStorage";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AnalysisHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cores do tema
  const bgColor = useThemeValue("background");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");
  const fabTextColor = useThemeValue("buttonText");

  // useFocusEffect garante que a lista é atualizada sempre que o utilizador volta a esta tela.
  useFocusEffect(
    useCallback(() => {
      async function loadHistory() {
        setIsLoading(true);
        const savedAnalyses = await getAnalysisHistory();
        setHistory(savedAnalyses);
        setIsLoading(false);
      }
      loadHistory();
    }, [])
  );

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Minhas Análises
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Veja seu histórico ou inicie uma nova medição.
        </ThemedText>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AnalysisHistoryItem item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="folder" size={48} color={textSecondary} />
            <ThemedText style={[styles.emptyText, { color: textColor }]}>
              Nenhuma análise encontrada
            </ThemedText>
            <ThemedText style={[styles.emptySubText, { color: textSecondary }]}>
              Clique no botão + para iniciar sua primeira análise.
            </ThemedText>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: accentColor }]}
        onPress={() => router.push("/analysis/select-type")}>
        <Feather name="plus" size={28} color={fabTextColor} />
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: Padding.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: Margin.xs,
  },
  list: {
    paddingBottom: 100,
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "30%",
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    marginTop: Margin.md,
  },
  emptySubText: {
    fontSize: FontSize.sm,
    marginTop: Margin.sm,
    textAlign: "center",
    maxWidth: "70%",
  },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
