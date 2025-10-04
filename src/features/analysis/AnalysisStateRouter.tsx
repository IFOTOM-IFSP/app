// src/features/analysis/AnalysisStateRouter.tsx
import { useAnalysisMachine } from "@/src/hooks/AnalysisMachineProvider";
import { router, usePathname } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

const norm = (p: string) => {
  const base = p.split("?")[0].split("#")[0];
  return base.endsWith("/") && base !== "/" ? base.slice(0, -1) : base;
};
const inCreate = (p: string) =>
  p.startsWith("/(tabs)/analysis/create/index") ||
  p.startsWith("/analysis/create/index");

export default function AnalysisStateRouter() {
  const { state } = useAnalysisMachine();
  const path = usePathname();

  const lastRef = useRef(norm(path));
  const safeReplace = useCallback(
    (to: string) => {
      const toN = norm(to),
        pN = norm(path);
      if (toN === pN || lastRef.current === toN) return;
      lastRef.current = toN;
      router.replace(toN);
    },
    [path]
  );

  useEffect(() => {
    lastRef.current = norm(path);
  }, [path]);

  useEffect(() => {
    const p = norm(path);
    if (!inCreate(p)) return;

    if (state.matches("CHOOSE_TYPE"))
      return safeReplace("/(tabs)/analysis/create/index");
    if (state.matches("PARAMS"))
      return safeReplace("/(tabs)/analysis/create/params");
    if (state.matches("PREFLIGHT"))
      return safeReplace("/(tabs)/analysis/create/preflight");
    if (state.matches("ACQUIRE"))
      return safeReplace("/(tabs)/analysis/create/acquire");
    if (state.matches("PROCESSING"))
      return safeReplace("/(tabs)/analysis/create/processing");
    if (state.matches("RESULTS"))
      return safeReplace("/(tabs)/analysis/create/result");
  }, [state.value, path, safeReplace]);

  return null;
}
