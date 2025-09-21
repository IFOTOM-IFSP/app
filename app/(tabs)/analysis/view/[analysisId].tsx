// app/(tabs)/analysis/history/[id].tsx  (ou ajuste ao seu path)
import { useAnalysisHistory } from "@/src/store/analysisHistoryStore";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useAnalysisHistory();

  const record = useMemo(() => items.find((i) => i.id === id), [id, items]);

  if (!id) return <Text style={styles.msg}>ID não informado.</Text>;
  if (!items.length)
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (!record) return <Text style={styles.msg}>Registro não encontrado.</Text>;

  const { name, ts, params, results, source, device_hash } = record;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.sub}>
        {new Date(ts).toLocaleString()}{" "}
        {source ? `• ${source.toUpperCase()}` : ""}{" "}
        {device_hash ? `• ${device_hash}` : ""}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parâmetros</Text>
        <Text>λ (nm): {params.lambda_nm}</Text>
        <Text>Janela Δ (nm): {params.window_nm ?? 4}</Text>
        <Text>Frames/Leitura: {params.frames_per_burst}</Text>
        {params.substance ? <Text>Substância: {params.substance}</Text> : null}
        <Text>
          Processamento:{" "}
          {params.useLocalCore ? "Local (prévia/offline)" : "API/Híbrido"}
        </Text>
        {params.build_curve ? (
          <Text>Curva construída nesta análise</Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resultados</Text>
        <Text>C: {results.C.toFixed(6)}</Text>
        <Text>
          Ā: {results.A_mean.toFixed(6)} (± {results.A_sd.toFixed(6)})
        </Text>
        <Text>
          CV%: {Number.isFinite(results.CV) ? results.CV.toFixed(2) : "–"}
        </Text>
        {results.CI95 ? (
          <Text>
            IC95%: [{results.CI95.low.toFixed(6)} ;{" "}
            {results.CI95.high.toFixed(6)}]
          </Text>
        ) : null}

        <View style={{ marginTop: 8 }}>
          <Text style={styles.cardSub}>QA</Text>
          <Text>Saturação: {results.QA.saturation ? "sim" : "não"}</Text>
          <Text>Outliers removidos: {results.QA.outliers}</Text>
          <Text>Dentro da faixa: {results.QA.in_range ? "sim" : "não"}</Text>
          <Text>Deriva: {results.QA.drift ? "sim" : "não"}</Text>
          {!!results.QA.notes?.length && (
            <Text>Notas: {results.QA.notes.join(" | ")}</Text>
          )}
        </View>
      </View>

      {results.calib ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Curva de Calibração (usada/derivada)
          </Text>
          <Text>
            m: {results.calib.m.toFixed(6)} • b: {results.calib.b.toFixed(6)}
          </Text>
          {results.calib.R2 != null && (
            <Text>R²: {results.calib.R2.toFixed(4)}</Text>
          )}
          {results.calib.SEE != null && (
            <Text>SEE: {results.calib.SEE.toFixed(6)}</Text>
          )}
          {(results.calib.LOD != null || results.calib.LOQ != null) && (
            <Text>
              LOD/LOQ: {results.calib.LOD?.toFixed(6) ?? "–"} /{" "}
              {results.calib.LOQ?.toFixed(6) ?? "–"}
            </Text>
          )}
          {results.calib.range && (
            <Text>
              Faixa C: [{results.calib.range.cmin} ; {results.calib.range.cmax}]
            </Text>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { opacity: 0.7, marginBottom: 8 },
  card: { padding: 12, borderRadius: 10, backgroundColor: "#f4f6f8" },
  cardTitle: { fontWeight: "700", marginBottom: 6 },
  cardSub: { fontWeight: "600" },
  msg: { padding: 16 },
});
