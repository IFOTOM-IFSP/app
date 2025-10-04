// src/features/analysis/AnalysisStateRouter.tsx
import { useAnalysisMachine } from "@/src/hooks/AnalysisMachineProvider";
import { router, usePathname, useRootNavigationState } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";

const norm = (p: string) => {
  const base = p.split("?")[0].split("#")[0];
  return base.endsWith("/") && base !== "/" ? base.slice(0, -1) : base;
};
const inCreate = (p: string) =>
  p.startsWith("/(tabs)/analysis/create/index") ||
  p.startsWith("/analysis/create/index");

export default function AnalysisStateRouter() {
  const { state } = useAnalysisMachine();
  const rawPath = usePathname();
  const navigationState = useRootNavigationState();

  const isNavigationReady = Boolean(navigationState?.key);
  const path = useMemo(() => rawPath ?? "/", [rawPath]);

  const lastRef = useRef(norm(path));
  const safeReplace = useCallback(
    (to: string) => {
      if (!isNavigationReady) return;
      const toN = norm(to),
        pN = norm(path);
      if (toN === pN || lastRef.current === toN) return;
      lastRef.current = toN;
      router.replace(toN);
    },
    [path, isNavigationReady]
  );

  useEffect(() => {
    if (!isNavigationReady) return;
    lastRef.current = norm(path);
  }, [path, isNavigationReady]);

  useEffect(() => {
    if (!isNavigationReady) return;
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
  }, [state.value, path, safeReplace, isNavigationReady]);

  return null;
}
