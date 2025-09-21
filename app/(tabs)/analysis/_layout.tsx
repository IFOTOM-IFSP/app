import { AnalysisMachineProvider } from "@/src/features/analysis/AnalysisMachineProvider";
import AnalysisStateRouter from "@/src/features/analysis/AnalysisStateRouter";
import { Stack } from "expo-router";

export default function AnalysisLayout() {
  return (
    <AnalysisMachineProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}></Stack>
      <AnalysisStateRouter />
    </AnalysisMachineProvider>
  );
}
