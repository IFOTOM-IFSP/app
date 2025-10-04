// src/features/analysis/AnalysisStateRouter.tsx
import { useAnalysisMachine } from "@/src/hooks/AnalysisMachineProvider";
import { router, usePathname, useRootNavigationState } from "expo-router";
import { useEffect, useMemo } from "react";

const norm = (p: string) => {
  const base = p.split("?")[0].split("#")[0];
  const trimmed = base.endsWith("/") && base !== "/" ? base.slice(0, -1) : base;
  return trimmed.endsWith("/index") ? trimmed.slice(0, -6) : trimmed;
};
const inCreate = (p: string) =>
  p.startsWith("/(tabs)/analysis/create") || p.startsWith("/analysis/create");

export default function AnalysisStateRouter() {
  const { state } = useAnalysisMachine();
  const rawPath = usePathname();
  const navigationState = useRootNavigationState();

  const isNavigationReady = Boolean(navigationState?.key);
  const path = useMemo(() => norm(rawPath ?? "/"), [rawPath]);

  const target = useMemo(() => {
    if (!inCreate(path)) return null;

    if (state.matches("CHOOSE_TYPE")) return "/(tabs)/analysis/create";
    if (state.matches("PARAMS")) return "/(tabs)/analysis/create/params";
    if (state.matches("PREFLIGHT") || state.matches("DECIDE_CALIB_DEVICE"))
      return "/(tabs)/analysis/create/preflight";
    if (state.matches("CALIB_DEVICE")) return "/(tabs)/analysis/create/calibrate";
    if (state.matches("CALIB_CURVE")) return "/(tabs)/analysis/create/baseline";
    if (state.matches("BUILD_CURVE")) return "/(tabs)/analysis/create/build-curve";
    if (
      state.matches("DECIDE_CURVE") ||
      state.matches("ACQ_DARK_NOISE") ||
      state.matches("ACQ_WHITE_NOISE") ||
      state.matches("ACQ_REF1") ||
      state.matches("ACQ_SAMPLE") ||
      state.matches("ACQ_REF2")
    )
      return "/(tabs)/analysis/create/measure";
    if (state.matches("PROCESSING")) return "/(tabs)/analysis/create/processing";
    if (
      state.matches("RESULTS") ||
      state.matches("QA_SAVE") ||
      state.matches("DONE")
    )
      return "/(tabs)/analysis/create/result";

    return null;
  }, [path, state.value]);

  useEffect(() => {
    if (!isNavigationReady || !target) return;

    const to = norm(target);
    if (to === path) return;

    router.replace(to);
  }, [target, path, isNavigationReady]);

  return null;
}
