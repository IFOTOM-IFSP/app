// app/analysis/results.tsx
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useAnalysisMachine } from "../../features/analysis/AnalysisMachineProvider";

export default function ResultsScreen() {
  const { state, send } = useAnalysisMachine();
  const r = state.context.results;
  const source = state.context.resultsSource ?? "api";

  const qaBadges = useMemo(() => {
    const q = r?.QA;
    if (!q) return [];
    const arr: string[] = [];
    if (q.saturation) arr.push("Saturação");
    if (q.drift) arr.push("Deriva");
    if (!q.in_range) arr.push("Fora da faixa");
    if ((q.outliers ?? 0) > 0) arr.push(`Outliers: ${q.outliers}`);
    return arr;
  }, [r]);

  return (
    <ScreenLayout>
      <View style={s.headerRow}>
        <ThemedText style={s.title}>Resultados</ThemedText>
        <View style={[s.badge, source === "api" ? s.badgeApi : s.badgeLocal]}>
          <ThemedText style={s.badgeText}>
            {source === "api" ? "API" : "Prévia local"}
          </ThemedText>
        </View>
      </View>

      {/* Cards numéricos */}
      <View style={s.cards}>
        <View style={s.card}>
          <ThemedText style={s.cardLabel}>Concentração</ThemedText>
          <ThemedText style={s.cardValue}>
            {r?.C?.toFixed(4)}{" "}
            {state.context.params?.substance
              ? `(${state.context.params?.substance})`
              : ""}
          </ThemedText>
          {r?.CI95 && (
            <ThemedText style={s.cardSub}>
              IC95: {r.CI95.low.toFixed(4)} – {r.CI95.high.toFixed(4)}
            </ThemedText>
          )}
        </View>
        <View style={s.card}>
          <ThemedText style={s.cardLabel}>Absorbância média</ThemedText>
          <ThemedText style={s.cardValue}>{r?.A_mean?.toFixed(4)}</ThemedText>
          <ThemedText style={s.cardSub}>CV% {r?.CV?.toFixed(2)}</ThemedText>
        </View>
        {r?.calib && (
          <View style={s.card}>
            <ThemedText style={s.cardLabel}>Curva</ThemedText>
            <ThemedText style={s.cardSub}>
              m={r.calib.m.toFixed(5)} | b={r.calib.b.toFixed(5)}{" "}
              {r.calib.R2 != null ? `| R²=${r.calib.R2.toFixed(4)}` : ""}
            </ThemedText>
            {r.calib.LOD != null && (
              <ThemedText style={s.cardSub}>
                LOD {r.calib.LOD.toPrecision(3)} | LOQ{" "}
                {r.calib.LOQ?.toPrecision(3)}
              </ThemedText>
            )}
          </View>
        )}
      </View>

      {/* Badges QA */}
      {qaBadges.length > 0 && (
        <View style={s.qaRow}>
          {qaBadges.map((b) => (
            <View key={b} style={s.qaBadge}>
              <ThemedText style={s.qaBadgeText}>{b}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* Gráficos — placeholder: plugue Victory Native ou SVG Charts */}
      <View style={s.chart}>
        <ThemedText>Curva A×C (padrões + linha; amostra destacada)</ThemedText>
      </View>
      <View style={s.chart}>
        <ThemedText>
          Espectro I×λ (dark/white/ref/sample) com janela sombreada
        </ThemedText>
      </View>

      <View style={{ marginTop: 16, gap: 8 }}>
        <Button
          title="Salvar Perfil"
          onPress={() =>
            send({
              type: "QA_SAVE_PROFILE",
              profile: state.context.deviceProfile!,
            })
          }
        />
        <Button
          title="Salvar Resultados"
          onPress={() => send({ type: "QA_SAVE_RESULTS" })}
        />
        <Button title="Concluir" onPress={() => send({ type: "NEXT" })} />
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700" },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeApi: { backgroundColor: "#e0f2fe" },
  badgeLocal: { backgroundColor: "#fef3c7" },
  badgeText: { fontWeight: "600" },
  cards: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    flexBasis: "48%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
  },
  cardLabel: { fontSize: 12, opacity: 0.7, marginBottom: 6 },
  cardValue: { fontSize: 18, fontWeight: "700" },
  cardSub: { fontSize: 12, opacity: 0.8, marginTop: 4 },
  qaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  qaBadge: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  qaBadgeText: { fontWeight: "600" },
  chart: {
    height: 180,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
