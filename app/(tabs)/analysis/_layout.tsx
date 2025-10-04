import { AnalysisMachineProvider } from "@/src/hooks/AnalysisMachineProvider";
import { Stack } from "expo-router";

export default function AnalysisLayout() {
  return (
    <AnalysisMachineProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AnalysisMachineProvider>
  );
}
