// app/analysis/measure.tsx
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import BackButton from "@/src/components/ui/BackButton";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useAnalysisMachine } from "../AnalysisMachineProvider";

export default function MeasurementSampleScreen() {
  const router = useRouter();
  const { state, send } = useAnalysisMachine();

  const text = useThemeValue("text");
  const tint = useThemeValue("tint");
  const secondary = useThemeValue("textSecondary");
  const border = useThemeValue("border");

  const learningMode = useSettingsStore((s) => s.learningMode);

  const isAcqSample = state.matches("ACQ_SAMPLE");
  const isAcqRef2 = state.matches("ACQ_REF2");
  const isProcessing = state.matches("PROCESSING");
  const isResults = state.matches("RESULTS");
  const hasError = Boolean(state.context.error) && !isProcessing;

  const stepNumber = 5; // ajuste se seu fluxo exibir badges de passo

  const headerTitle = useMemo(() => {
    if (isAcqSample) return "Medindo amostra";
    if (isAcqRef2) return "Capturando referência (pós-amostra)";
    if (isProcessing) return "Processando…";
    if (isResults) return "Medição concluída";
    if (hasError) return "Erro na medição";
    return "Medição da Amostra";
  }, [isAcqSample, isAcqRef2, isProcessing, isResults, hasError]);

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={styles.header}>
        <BackButton color={text} style={styles.baseContainer} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}>
            <ThemedText style={styles.stepBadgeText}>
              {String(stepNumber)}
            </ThemedText>
          </View>
          <ThemedText style={styles.headerTitle}>{headerTitle}</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Ajuda didática (modo aprendizagem) */}
      {learningMode && (
        <View style={[styles.helpBox, { borderColor: border }]}>
          <ThemedText style={styles.helpItem}>
            • O fluxo é sequencial (pseudo double-beam):{" "}
            <ThemedText style={styles.bold}>
              dark → ref → sample → ref2
            </ThemedText>
            . Aqui você está na etapa de amostra.
          </ThemedText>
          <ThemedText style={styles.helpItem}>
            • Após a amostra, capturamos uma segunda referência para corrigir{" "}
            <ThemedText style={styles.bold}>drift</ThemedText> por interpolação
            temporal.
          </ThemedText>
          <ThemedText style={styles.helpItem}>
            • O processamento aplica janela em λ, remove outliers (MAD), calcula
            A e C com IC95.
          </ThemedText>
        </View>
      )}

      {/* Estados / progresso */}
      {(isAcqSample || isAcqRef2 || isProcessing) && (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" />
          <ThemedText style={[styles.progressText, { color: secondary }]}>
            {isAcqSample && "Capturando amostra…"}
            {isAcqRef2 && "Capturando referência pós-amostra…"}
            {isProcessing && "Processando resultados…"}
          </ThemedText>
        </View>
      )}

      {/* Resultado pronto */}
      {isResults && (
        <View style={styles.actions}>
          <ThemedText style={[styles.successText, { color: secondary }]}>
            Medição concluída com sucesso. Você pode revisar os números,
            gráficos e QA.
          </ThemedText>
          <Button
            title="Ver resultados"
            onPress={() => router.push("/analysis/results")}
          />
          <Button
            title="Medir novamente"
            variant="outline"
            onPress={() => {
              // Volta para medir amostra de novo:
              // a máquina aceita RETRY em PROCESSING, então primeiro vamos a PROCESSING rapidamente:
              send({ type: "RETRY" }); // se estiver em RESULTS, você pode RESET e recomeçar o fluxo, se preferir.
            }}
          />
        </View>
      )}

      {/* Erro */}
      {hasError && (
        <View style={styles.actions}>
          <ThemedText style={[styles.errorText]}>
            Ocorreu um erro: {state.context.error}
          </ThemedText>
          <Button
            title="Tentar novamente"
            onPress={() => send({ type: "RETRY" })}
          />
          <Button
            title="Reiniciar fluxo"
            variant="outline"
            onPress={() => {
              send({ type: "RESET" });
              router.replace("/analysis/params");
            }}
          />
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    marginBottom: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  baseContainer: { padding: 0, backgroundColor: "transparent" },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepBadgeText: { color: "white", fontWeight: "bold", fontSize: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },

  helpBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  helpItem: { fontSize: 15, lineHeight: 22, marginBottom: 6 },
  bold: { fontWeight: "600" },

  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
  },
  progressText: { fontSize: 16 },

  actions: { gap: 12, marginTop: 12 },
  successText: { fontSize: 15 },
  errorText: { fontSize: 15, color: "#B00020" },
});
