// app/analysis/processing.tsx
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ActivityIndicator } from "react-native";
import { useAnalysisMachine } from "../../hooks/AnalysisMachineProvider";

export default function ProcessingScreen() {
  const { state } = useAnalysisMachine();
  return (
    <ScreenLayout>
      <ThemedText style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
        {state.context.params?.useLocalCore
          ? "Calculando (prévia local)…"
          : "Enviando para a API…"}
      </ThemedText>
      <ActivityIndicator />
    </ScreenLayout>
  );
}
