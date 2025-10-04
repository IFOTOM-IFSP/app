// src/features/analysis/AnalysisStateRouter.tsx
import { useAnalysisMachine } from "@/src/hooks/AnalysisMachineProvider";
import { router, usePathname, useRootNavigationState } from "expo-router";
import { useEffect, useMemo, useRef } from "react";

const stripRouteGroups = (p: string) => p.replace(/\/\([^/]+\)/g, "");

const norm = (p: string) => {
  const base = p.split("?")[0].split("#")[0];
  const withoutGroups = stripRouteGroups(base);
  const trimmed =
    withoutGroups.endsWith("/") && withoutGroups !== "/"
      ? withoutGroups.slice(0, -1)
      : withoutGroups;
  return trimmed.endsWith("/index") ? trimmed.slice(0, -6) : trimmed;
};

export default function AnalysisStateRouter() {
  const { state } = useAnalysisMachine();
  const rawPath = usePathname();
  const navigationState = useRootNavigationState();

  const isNavigationReady = Boolean(navigationState?.key);
  const path = useMemo(() => rawPath ?? "/", [rawPath]);
  const normalizedPath = useMemo(() => norm(path), [path]);
  const lastReplacedPathRef = useRef(normalizedPath);

  const target = useMemo(() => {
    if (!normalizedPath.startsWith("/analysis/create")) return null;

    if (state.matches("CHOOSE_TYPE")) return "/analysis/create";
    if (state.matches("PARAMS")) return "/analysis/create/params";
    if (state.matches("PREFLIGHT") || state.matches("DECIDE_CALIB_DEVICE"))
      return "/analysis/create/preflight";
    if (state.matches("CALIB_DEVICE")) return "/analysis/create/calibrate";
    if (state.matches("CALIB_CURVE")) return "/analysis/create/baseline";
    if (state.matches("BUILD_CURVE")) return "/analysis/create/build-curve";
    if (
      state.matches("DECIDE_CURVE") ||
      state.matches("ACQ_DARK_NOISE") ||
      state.matches("ACQ_WHITE_NOISE") ||
      state.matches("ACQ_REF1") ||
      state.matches("ACQ_SAMPLE") ||
      state.matches("ACQ_REF2")
    )
      return "/analysis/create/measure";
    if (state.matches("PROCESSING")) return "/analysis/create/processing";
    if (
      state.matches("RESULTS") ||
      state.matches("QA_SAVE") ||
      state.matches("DONE")
    )
      return "/analysis/create/result";

    return null;
  }, [normalizedPath, state.value]);

  useEffect(() => {
    if (!isNavigationReady) return;
    lastReplacedPathRef.current = normalizedPath;
  }, [normalizedPath, isNavigationReady]);

  useEffect(() => {
    if (!isNavigationReady || !target) return;

    const to = norm(target);
    if (to === normalizedPath || lastReplacedPathRef.current === to) return;

    lastReplacedPathRef.current = to;
    router.replace(to);
  }, [target, normalizedPath, isNavigationReady]);

  return null;
}
