import { router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { useAnalysisMachine } from "./AnalysisMachineProvider";

function normalizePath(p: string) {
  const base = p.split("?")[0].split("#")[0];
  return base.endsWith("/") && base !== "/" ? base.slice(0, -1) : base;
}
function inCreateFlow(path: string) {
  const p = normalizePath(path);
  return (
    p.startsWith("/(tabs)/analysis/create") || p.startsWith("/analysis/create")
  );
}

export function useSyncRouteWithState() {
  const { state } = useAnalysisMachine();
  const path = usePathname();

  const lastPathRef = useRef<string | null>(null);
  const safeReplace = (to: string) => {
    if (normalizePath(lastPathRef.current ?? "") === normalizePath(to)) return;
    if (normalizePath(path) === normalizePath(to)) return;
    lastPathRef.current = to;
    router.replace(to);
  };

  const analysisType = state.context?.analysisType;

  useEffect(() => {
    if (!inCreateFlow(path)) return;

    if (state.matches("CHOOSE_TYPE")) {
      safeReplace("/(tabs)/analysis/create/index");
      return;
    }

    if (state.matches("PARAMS")) {
      if (analysisType === "quant") {
        safeReplace("/(tabs)/analysis/create/params");
      } else {
        safeReplace("/(tabs)/analysis/create/index");
      }
      return;
    }

    if (
      state.matches("ACQ_DARK_NOISE") ||
      state.matches("ACQ_WHITE_NOISE") ||
      state.matches("ACQ_REF1") ||
      state.matches("CALIB_CURVE") ||
      state.matches("ACQ_SAMPLE") ||
      state.matches("ACQ_REF2")
    ) {
      safeReplace("/(tabs)/analysis/create/capture-base");
      return;
    }

    if (state.matches("RESULTS")) {
      safeReplace("/(tabs)/analysis/create/result");
      return;
    }
  }, [state.value, analysisType, path]);
}

export default function AnalysisStateRouter() {
  useSyncRouteWithState();
  return null;
}
