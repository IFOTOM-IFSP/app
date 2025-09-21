// import { useHistoryStore } from "@/store/historyStore";
// import { router, useFocusEffect } from "expo-router";
// import React from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function AnalysesHistoryScreen() {
//   const { historyList, status, loadHistoryList } = useHistoryStore();

//   // useFocusEffect recarrega os dados toda vez que a tela entra em foco
//   useFocusEffect(
//     React.useCallback(() => {
//       loadHistoryList();
//     }, [])
//   );

//   if (status === "loading") {
//     return <ActivityIndicator style={{ flex: 1 }} size="large" />;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Histórico de Análises</Text>
//       <FlatList
//         data={historyList}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.itemContainer}
//             onPress={() => router.push(`/history/${item.id}`)}>
//             <Text style={styles.itemTitle}>{item.setupData.analysisName}</Text>
//             <Text style={styles.itemSubtitle}>{item.setupData.substance}</Text>
//             <Text style={styles.itemDate}>
//               {new Date(item.savedAt).toLocaleString("pt-BR")}
//             </Text>
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>Nenhuma análise salva ainda.</Text>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f0f4f8" },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   itemContainer: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   itemTitle: { fontSize: 18, fontWeight: "bold" },
//   itemSubtitle: { fontSize: 16, color: "#555" },
//   itemDate: { fontSize: 12, color: "#888", marginTop: 5, textAlign: "right" },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 50,
//     fontSize: 16,
//     color: "#888",
//   },
// });
// app/analysis/history.tsx
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useAnalysisHistory } from "@/store/analysisHistoryStore";
import { router } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function HistoryScreen() {
  const items = useAnalysisHistory((s) => s.items);
  return (
    <FlatList
      contentContainerStyle={{ padding: 16, gap: 12 }}
      data={items}
      keyExtractor={(i) => i.id}
      ListEmptyComponent={
        <ThemedText style={{ textAlign: "center", marginTop: 40 }}>
          Nenhuma análise salva ainda.
        </ThemedText>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/analysis/history/[id]",
              params: { id: item.id },
            })
          }>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <ThemedText style={styles.title}>{item.name}</ThemedText>
            <ThemedText style={styles.badge}>
              {item.source === "api" ? "API" : "Local"}
            </ThemedText>
          </View>
          <ThemedText style={styles.sub}>
            λ={item.params.lambda_nm} nm • Frames={item.params.frames_per_burst}{" "}
            • {new Date(item.ts).toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.value}>
            C = {item.results.C.toPrecision(4)}
          </ThemedText>
        </TouchableOpacity>
      )}
    />
  );
}
const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
  },
  title: { fontSize: 16, fontWeight: "700" },
  sub: { opacity: 0.7, marginTop: 2 },
  value: { marginTop: 6, fontWeight: "700" },
  badge: { backgroundColor: "#eef2ff", paddingHorizontal: 8, borderRadius: 99 },
});
