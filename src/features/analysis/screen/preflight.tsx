// app/analysis/preflight.tsx
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { View } from "react-native";
import { useAnalysisMachine } from "../AnalysisMachineProvider";

export default function PreflightScreen() {
  const { state } = useAnalysisMachine();
  return (
    <ScreenLayout>
      <ThemedText style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
        Pré-checagens
      </ThemedText>
      <ThemedText>Verificando perfil, ROI e RMSE de λ…</ThemedText>
      {state.context.error && (
        <View style={{ marginTop: 16 }}>
          <ThemedText style={{ color: "tomato" }}>
            {state.context.error}
          </ThemedText>
          <ThemedText>Corrija e volte aos parâmetros.</ThemedText>
        </View>
      )}
    </ScreenLayout>
  );
}
