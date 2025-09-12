import { useHistoryStore } from "@/store/historyStore";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AnalysesHistoryScreen() {
  const { historyList, status, loadHistoryList } = useHistoryStore();

  // useFocusEffect recarrega os dados toda vez que a tela entra em foco
  useFocusEffect(
    React.useCallback(() => {
      loadHistoryList();
    }, [])
  );

  if (status === "loading") {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Análises</Text>
      <FlatList
        data={historyList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => router.push(`/history/${item.id}`)}>
            <Text style={styles.itemTitle}>{item.setupData.analysisName}</Text>
            <Text style={styles.itemSubtitle}>{item.setupData.substance}</Text>
            <Text style={styles.itemDate}>
              {new Date(item.savedAt).toLocaleString("pt-BR")}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma análise salva ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f4f8" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
  itemSubtitle: { fontSize: 16, color: "#555" },
  itemDate: { fontSize: 12, color: "#888", marginTop: 5, textAlign: "right" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});
