// app/analysis/acquire.tsx
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAnalysisMachine } from "../AnalysisMachineProvider";

type Step = { key: string; label: string };
const STEPS: Step[] = [
  { key: "ACQ_DARK_NOISE", label: "Ruído preto (dark)" },
  { key: "ACQ_WHITE_NOISE", label: "Ruído branco (white)" },
  { key: "ACQ_REF1", label: "Referência (ref 1)" },
  { key: "ACQ_SAMPLE", label: "Amostra (sample)" },
  { key: "ACQ_REF2", label: "Referência 2 (ref 2)" },
];

export default function AcquireScreen() {
  const { state, send } = useAnalysisMachine();
  const currentKey = String(state.value);

  const idx = STEPS.findIndex((s) => s.key === currentKey);
  const isProcessing = idx === -1; // entrou/saindo entre invocações
  const next = () => send({ type: "NEXT" });

  return (
    <ScreenLayout>
      <ThemedText style={styles.title}>Aquisição</ThemedText>
      <View style={{ gap: 10 }}>
        {STEPS.map((s, i) => {
          const status = i < idx ? "ok" : i === idx ? "busy" : "todo";
          return (
            <View
              key={s.key}
              style={[
                styles.step,
                status === "ok" && styles.ok,
                status === "busy" && styles.busy,
              ]}>
              <ThemedText>{s.label}</ThemedText>
              {status === "busy" && <ActivityIndicator />}
              {status === "ok" && <ThemedText>✓</ThemedText>}
            </View>
          );
        })}
      </View>

      {state.context.error && (
        <ThemedText style={{ color: "tomato", marginTop: 12 }}>
          {state.context.error}
        </ThemedText>
      )}

      <View style={{ marginTop: 16 }}>
        <Button title="Próximo" onPress={next} disabled={isProcessing} />
      </View>

      <View style={styles.help}>
        <ThemedText style={{ fontWeight: "600" }}>Dica:</ThemedText>
        <ThemedText>
          mantemos AE/AWB travados e abortamos se saturar (&gt;~90%).
        </ThemedText>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  step: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  ok: { backgroundColor: "#ecfdf5", borderColor: "#10b98133" },
  busy: { backgroundColor: "#eff6ff", borderColor: "#3b82f633" },
  help: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
  },
});
