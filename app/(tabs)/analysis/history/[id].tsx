// app/analysis/history/[id].tsx
import CalibrationChart from "@/src/components/charts/CalibrationChart";
import SpectrumPlot from "@/src/components/charts/SpectrumPlot";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useAnalysisHistory } from "@/store/analysisHistoryStore";
import { useLocalSearchParams } from "expo-router";

export default function HistoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useAnalysisHistory((s) => s.items.find((i) => i.id === id));

  if (!item)
    return (
      <ScreenLayout>
        <ThemedText>Item não encontrado.</ThemedText>
      </ScreenLayout>
    );

  return (
    <ScreenLayout>
      <ThemedText style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
        {item.name}
      </ThemedText>
      <ThemedText>
        λ = {item.params.lambda_nm} nm • Δ = {item.params.window_nm ?? 4} nm
      </ThemedText>
      <ThemedText style={{ marginTop: 6, fontWeight: "700" }}>
        C = {item.results.C.toPrecision(4)}
      </ThemedText>

      <SpectrumPlot
        spectrum={item.results.spectrum}
        lambda_nm={item.params.lambda_nm}
        window_nm={item.params.window_nm ?? 4}
      />

      <CalibrationChart
        calib={item.results.calib}
        sampleA={item.results.A_mean}
        // opcional: se você tiver os pontos de padrões salvos em outro lugar, passe em "points"
      />
    </ScreenLayout>
  );
}
