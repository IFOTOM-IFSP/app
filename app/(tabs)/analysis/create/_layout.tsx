import AnalysisStateRouter from "@/src/features/analysis/AnalysisStateRouter";
import { Stack } from "expo-router";

export default function CreateLayout() {
  return (
    <>
      <AnalysisStateRouter />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
