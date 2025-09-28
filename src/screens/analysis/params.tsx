// app/analysis/params.tsx
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { Button } from "@/src/components/ui/Button";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useSettingsStore } from "@/src/store/settingsStore"; // <<< novo
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { useAnalysisMachine } from "../../features/analysis/AnalysisMachineProvider";

export default function ParamsScreen() {
  const { state, send } = useAnalysisMachine();
  const tint = useThemeValue("tint");
  useEffect(() => {
    if (state.matches("CHOOSE_TYPE")) {
      send({ type: "SELECT_TYPE", value: "quant" });
    }
  }, [state, send]);

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

  const [form, setForm] = useState(defaults);

  return (
    <ScreenLayout>
      <ThemedText style={styles.title}>Parâmetros</ThemedText>

      {learningMode && (
        <View style={styles.helpBox}>
          <ThemedText>
            • <ThemedText style={styles.bold}>λ de análise</ThemedText>: use o
            λmax da espécie. Janela integra em [λ±Δ/2] para robustez.
          </ThemedText>
          <ThemedText>
            • <ThemedText style={styles.bold}>Frames por leitura</ThemedText>:
            mais frames → menos ruído, porém maior tempo.
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

      <ThemedInput
        label="Nome"
        value={String(form.name)}
        onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
      />
      <ThemedInput
        label="Substância"
        value={String(form.substance)}
        onChangeText={(v) => setForm((f) => ({ ...f, substance: v }))}
      />

      <View style={styles.twoCols}>
        <ThemedInput
          label="λ (nm)"
          keyboardType="numeric"
          value={String(form.lambda_nm)}
          onChangeText={(v) =>
            setForm((f) => ({ ...f, lambda_nm: Number(v) || 0 }))
          }
        />
        <ThemedInput
          label="Janela Δ (nm)"
          keyboardType="numeric"
          value={String(form.window_nm)}
          onChangeText={(v) =>
            setForm((f) => ({ ...f, window_nm: Number(v) || 0 }))
          }
        />
      </View>

      <View style={styles.twoCols}>
        <ThemedInput
          label="Frames por leitura"
          keyboardType="numeric"
          value={String(form.frames_per_burst)}
          onChangeText={(v) =>
            setForm((f) => ({
              ...f,
              frames_per_burst: Math.max(1, Number(v) || 1),
            }))
          }
        />
        <View style={styles.switchBox}>
          <ThemedText>Construir curva agora</ThemedText>
          <Switch
            value={!!form.build_curve}
            onValueChange={(v) => setForm((f) => ({ ...f, build_curve: v }))}
          />
        </View>
      </View>

      <View style={styles.row}>
        <ThemedText>Processamento local (prévia/offline)</ThemedText>
        <Switch
          value={!!form.useLocalCore}
          onValueChange={(v) => setForm((f) => ({ ...f, useLocalCore: v }))}
        />
      </View>

      <Button
        title="Continuar"
        onPress={() => {
          send({
            type: "SUBMIT_PARAMS",
            params: {
              name: form.name,
              substance: form.substance,
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
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  bold: { fontWeight: "600" },
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
