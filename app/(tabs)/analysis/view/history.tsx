import { useAnalysisHistory } from "@/src/store/analysisHistoryStore";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function HistoryListScreen() {
  const router = useRouter();
  const { items, clear } = useAnalysisHistory();

  const sorted = useMemo(() => [...items].sort((a, b) => b.ts - a.ts), [items]);

  if (!items) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Análises</Text>

      {sorted.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Você ainda não salvou nenhuma análise.
          </Text>
          <Text style={styles.emptySub}>
            Ao finalizar uma análise, toque em “Salvar” para ela aparecer aqui.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={sorted}
            keyExtractor={(it) => it.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push(`/(tabs)/analysis/view/history/${item.id}`)
                }
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.85 },
                ]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name || "Análise"}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          item.source === "api" ? "#2563eb" : "#6b7280",
                      },
                    ]}>
                    <Text style={styles.badgeText}>
                      {item.source === "api" ? "API" : "Local"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardRow}>
                  <Text style={styles.muted}>Data:</Text> {formatDate(item.ts)}
                </Text>
                <Text style={styles.cardRow}>
                  <Text style={styles.muted}>λ:</Text> {item.params.lambda_nm}{" "}
                  nm{"  "}
                  <Text style={styles.muted}>Δ:</Text>{" "}
                  {item.params.window_nm ?? 4} nm
                </Text>
                <Text style={styles.cardRow}>
                  <Text style={styles.muted}>Frames:</Text>{" "}
                  {item.params.frames_per_burst}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.cardRow}>
                  <Text style={styles.muted}>C:</Text>{" "}
                  {item.results.C.toFixed(4)}
                  {item.results.CI95
                    ? `  (± ${(
                        (item.results.CI95.high - item.results.CI95.low) /
                        2
                      ).toFixed(4)})`
                    : ""}
                </Text>
                <Text style={styles.cardRow}>
                  <Text style={styles.muted}>Ā:</Text>{" "}
                  {item.results.A_mean.toFixed(4)}
                  {"  "}
                  <Text style={styles.muted}>CV:</Text>{" "}
                  {Number.isFinite(item.results.CV)
                    ? `${item.results.CV.toFixed(1)}%`
                    : "—"}
                </Text>

                <View style={styles.qaRow}>
                  {item.results.QA?.saturation ? (
                    <Text style={[styles.qaBadge, styles.qaBad]}>
                      Saturação
                    </Text>
                  ) : null}
                  {item.results.QA?.drift ? (
                    <Text style={[styles.qaBadge, styles.qaWarn]}>Deriva</Text>
                  ) : null}
                  {item.results.QA?.in_range === false ? (
                    <Text style={[styles.qaBadge, styles.qaWarn]}>
                      Fora da faixa
                    </Text>
                  ) : null}
                  {!!item.results.QA?.outliers &&
                  item.results.QA.outliers > 0 ? (
                    <Text style={[styles.qaBadge, styles.qaInfo]}>
                      Outliers:{item.results.QA.outliers}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            )}
          />

          <Pressable onPress={clear} style={styles.clearBtn}>
            <Text style={styles.clearText}>Limpar histórico</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  emptyBox: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  emptyText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  emptySub: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 4,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardRow: { fontSize: 14, marginTop: 2 },
  muted: { color: "#6b7280" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 8 },
  qaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  qaBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    color: "#111827",
    backgroundColor: "#e5e7eb",
  },
  qaBad: { backgroundColor: "#fecaca", color: "#7f1d1d" },
  qaWarn: { backgroundColor: "#fde68a", color: "#78350f" },
  qaInfo: { backgroundColor: "#bae6fd", color: "#0c4a6e" },
  clearBtn: {
    alignSelf: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  clearText: { color: "#fff", fontWeight: "700" },
});
