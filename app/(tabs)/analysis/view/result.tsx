// app/analysis/results.tsx
import { buildActionMessages } from "@/lib/quality";
import CalibrationChart from "@/src/components/charts/CalibrationChart";
import SpectrumPlot from "@/src/components/charts/SpectrumPlot";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useAnalysisMachine } from "@/src/features/analysis/AnalysisMachineProvider";
import { useAnalysisHistory } from "@/store/analysisHistoryStore";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

function QABadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "ok" | "warn" | "err" | "default";
}) {
  const bg =
    tone === "ok"
      ? "#dcfce7"
      : tone === "warn"
      ? "#fef9c3"
      : tone === "err"
      ? "#fee2e2"
      : "#e5e7eb";
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <ThemedText>{label}</ThemedText>
    </View>
  );
}

export default function ResultsScreen() {
  const { state, send } = useAnalysisMachine();
  const r = state.context.results;
  const addHistory = useAnalysisHistory((s) => s.add);

  if (!r) {
    return (
      <ScreenLayout>
        <ThemedText style={{ fontSize: 18, fontWeight: "700" }}>
          Sem resultados
        </ThemedText>
        <Button title="Voltar" onPress={() => send({ type: "RETRY" })} />
      </ScreenLayout>
    );
  }

  // Cards numéricos
  const fmt = (v?: number) =>
    Number.isFinite(v!) ? Number(v).toPrecision(4) : "-";
  const msgs = buildActionMessages({
    A_mean: r.A_mean,
    driftPct: r.QA?.drift ? 0.06 : 0, // (se tiver drift% em outro lugar, passe real)
    qa: {
      in_range: r.QA?.in_range,
      saturation: r.QA?.saturation,
      outliers: r.QA?.outliers,
    },
  });

  return (
    <ScreenLayout>
      <ThemedText style={styles.title}>Resultados</ThemedText>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Concentração</ThemedText>
          <ThemedText style={styles.value}>
            {fmt(r.C)}{" "}
            {state.context.params?.substance
              ? `(${state.context.params?.substance})`
              : ""}
          </ThemedText>
          {r.CI95 && (
            <ThemedText style={styles.sub}>
              IC95: {fmt(r.CI95.low)} – {fmt(r.CI95.high)}
            </ThemedText>
          )}
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Absorbância</ThemedText>
          <ThemedText style={styles.value}>{fmt(r.A_mean)}</ThemedText>
          <ThemedText style={styles.sub}>CV%: {fmt(r.CV)}</ThemedText>
        </View>
      </View>

      {r.calib && (
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Curva</ThemedText>
          <ThemedText>
            m = {fmt(r.calib.m)} | b = {fmt(r.calib.b)}{" "}
            {r.calib.R2 != null ? `| R² = ${fmt(r.calib.R2)}` : ""}
          </ThemedText>
          {r.calib.LOD != null && r.calib.LOQ != null && (
            <ThemedText>
              LOD ≈ {fmt(r.calib.LOD)} | LOQ ≈ {fmt(r.calib.LOQ)}
            </ThemedText>
          )}
        </View>
      )}

      {/* Badges QA */}
      <View style={styles.badges}>
        <QABadge
          label={r.QA?.in_range ? "Na faixa da curva" : "Fora da faixa"}
          tone={r.QA?.in_range ? "ok" : "warn"}
        />
        {r.QA?.drift && <QABadge label="Deriva detectada" tone="warn" />}
        {r.QA?.saturation && <QABadge label="Saturação" tone="err" />}
        {r.QA?.outliers ? (
          <QABadge label={`Outliers removidos: ${r.QA.outliers}`} tone="warn" />
        ) : null}
      </View>

      {/* Gráficos */}
      <SpectrumPlot
        spectrum={r.spectrum}
        lambda_nm={state.context.params?.lambda_nm ?? 0}
        window_nm={state.context.params?.window_nm ?? 4}
      />

      <CalibrationChart
        calib={r.calib}
        sampleA={r.A_mean}
        // points: (se você tiver os pontos dos padrões, pode passar aqui)
      />

      {/* Mensagens de ação */}
      {msgs.length ? (
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Sugestões</ThemedText>
          {msgs.map((m, i) => (
            <ThemedText key={i}>• {m}</ThemedText>
          ))}
        </View>
      ) : null}

      {/* Ações */}
      <View style={{ gap: 12, marginTop: 12 }}>
        <Button
          title="Salvar resultados"
          onPress={() => {
            if (state.context.params && state.context.results) {
              addHistory(
                // resultsSource é setado na máquina quando a quantificação termina
                // @ts-ignore
                require("@/store/analysisHistoryStore").buildSavedAnalysis(
                  state.context.params,
                  state.context.results,
                  state.context.deviceProfile,
                  state.context.resultsSource
                )
              );
            }
            send({ type: "QA_SAVE_RESULTS" });
          }}
        />
        <Button title="Nova medição" onPress={() => send({ type: "RESET" })} />
        <Button
          title="Ver histórico"
          onPress={() => router.push("/analysis/history")}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
  },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  value: { fontSize: 18, fontWeight: "700" },
  sub: { opacity: 0.7, marginTop: 2 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
});
