// app/analysis/params.tsx
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { Button } from "@/src/components/ui/Button";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useSettingsStore } from "@/src/store/settingsStore"; // <<< novo
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { useAnalysisMachine } from "../../hooks/AnalysisMachineProvider";

export default function ParamsScreen() {
  const { state, send } = useAnalysisMachine();
  const analysisType = state.context.analysisType;
  const tint = useThemeValue("tint");

  // ✅ Guarda de rota – só fica aqui se a máquina disser que é PARAMS de quant
  useEffect(() => {
    if (!state.matches("PARAMS") || analysisType !== "quant") {
      router.replace("/(tabs)/analysis/create/index");
    }
  }, [state.value, analysisType]);

  // Evita flash enquanto redireciona
  if (!state.matches("PARAMS") || analysisType !== "quant") return null;

  // (opcional) log para depurar
  useEffect(() => {
    console.log("MACHINE STATE:", state.value);
    console.log("analysisType:", state.context.analysisType);
  }, [state.value]);

  const learningMode = useSettingsStore((s) => s.learningMode);
  const setLearningMode = useSettingsStore((s) => s.setLearningMode);

  const defaults = useMemo(
    () => ({
      lambda_nm: state.context.params?.lambda_nm ?? 532,
      window_nm: state.context.params?.window_nm ?? 4,
      frames_per_burst: state.context.params?.frames_per_burst ?? 10,
      build_curve: state.context.params?.build_curve ?? false,
      useLocalCore: state.context.params?.useLocalCore ?? false,
      name: state.context.params?.name ?? "Análise Quantitativa",
      substance: state.context.params?.substance ?? "",
    }),
    [state.context.params]
  );

  const [form, setForm] = useState({
    lambda_nm: defaults.lambda_nm,
    window_nm: defaults.window_nm,
    frames_per_burst: defaults.frames_per_burst,
    build_curve: defaults.build_curve,
    useLocalCore: defaults.useLocalCore,
    name: defaults.name,
    substance: defaults.substance,
  });

  return (
    <ScreenLayout>
      <ThemedText style={styles.title}>Parâmetros da Análise</ThemedText>

      <View style={styles.twoCols}>
        <ThemedInput
          label="λ (nm)"
          keyboardType="numeric"
          value={String(form.lambda_nm)}
          onChangeText={(t) =>
            setForm((m) => ({
              ...m,
              lambda_nm: Number(t.replace(",", ".")) || 0,
            }))
          }
        />
        <ThemedInput
          label="Janela (nm)"
          keyboardType="numeric"
          value={String(form.window_nm)}
          onChangeText={(t) =>
            setForm((m) => ({
              ...m,
              window_nm: Number(t.replace(",", ".")) || 0,
            }))
          }
        />
      </View>

      <ThemedInput
        label="Frames por burst"
        keyboardType="numeric"
        value={String(form.frames_per_burst)}
        onChangeText={(t) =>
          setForm((m) => ({
            ...m,
            frames_per_burst: Number(t.replace(",", ".")) || 0,
          }))
        }
      />

      <View style={styles.row}>
        <ThemedText>Construir curva de calibração</ThemedText>
        <Switch
          value={form.build_curve}
          onValueChange={(v) => setForm((m) => ({ ...m, build_curve: v }))}
        />
      </View>

      <View style={styles.row}>
        <ThemedText>Processamento local (prévia)</ThemedText>
        <Switch
          value={form.useLocalCore}
          onValueChange={(v) => setForm((m) => ({ ...m, useLocalCore: v }))}
        />
      </View>

      {learningMode && (
        <View style={styles.helpBox}>
          <ThemedText style={styles.bold}>Dicas</ThemedText>
          <ThemedText>• λ: centralize no λmáx do analito.</ThemedText>
          <ThemedText>
            • Janela: pequena o suficiente para focar no pico, grande o
            suficiente para reduzir ruído (p.ex. 4–10 nm).
          </ThemedText>
          <ThemedText>
            • Frames: mais frames → menos ruído, porém maior tempo.
          </ThemedText>
          <ThemedText>
            • <ThemedText style={styles.bold}>Processamento local</ThemedText>:
            prévia/offline; o oficial vem da API quando disponível.
          </ThemedText>
        </View>
      )}

      <View style={styles.row}>
        <ThemedText>Mostrar explicações (modo aprendizagem)</ThemedText>
        <Switch value={learningMode} onValueChange={setLearningMode} />
      </View>

      <Button
        style={{ marginTop: 16, backgroundColor: tint }}
        title="Continuar"
        onPress={() => {
          send({
            type: "SUBMIT_PARAMS",
            params: {
              lambda_nm: form.lambda_nm,
              window_nm: form.window_nm,
              frames_per_burst: form.frames_per_burst,
              build_curve: form.build_curve,
              standards: form.build_curve
                ? [{ C: 0.1 }, { C: 0.2 }, { C: 0.4 }, { C: 0.8 }, { C: 1.2 }]
                : undefined,
              useLocalCore: form.useLocalCore,
            },
          });
        }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  helpBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  bold: { fontWeight: "700" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  twoCols: { flexDirection: "row", gap: 12 },
  switchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
