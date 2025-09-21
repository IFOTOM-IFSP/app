import { router, usePathname } from "expo-router";
import { useEffect } from "react";
import { useAnalysisMachine } from "./AnalysisMachineProvider";

export function useSyncRouteWithState() {
  const { state } = useAnalysisMachine();
  const path = usePathname();

  useEffect(() => {
    const m = state.value;
    if (m === "PARAMS" && !path.endsWith("/create/[analysisFormId]")) {
      router.replace("/(tabs)/analysis/create/[analysisFormId]");
    } else if (m === "PREFLIGHT" && !path.endsWith("/create/preflight")) {
      router.replace("/(tabs)/analysis/create/preflight");
    } else if (m === "CALIB_DEVICE" && !path.endsWith("/create/calibrate")) {
      router.replace("/(tabs)/analysis/create/calibrate");
    } else if (
      (m === "ACQ_DARK_NOISE" || m === "ACQ_WHITE_NOISE" || m === "ACQ_REF1") &&
      !path.endsWith("/create/baseline")
    ) {
      router.replace("/(tabs)/analysis/create/baseline");
    } else if (
      (m === "CALIB_CURVE" || m === "BUILD_CURVE") &&
      !path.endsWith("/create/build-curve")
    ) {
      router.replace("/(tabs)/analysis/create/build-curve");
    } else if (
      (m === "ACQ_SAMPLE" || m === "ACQ_REF2") &&
      !path.endsWith("/create/measure")
    ) {
      router.replace("/(tabs)/analysis/create/measure");
    } else if (m === "PROCESSING" && !path.endsWith("/create/processing")) {
      router.replace("/(tabs)/analysis/create/processing");
    } else if (m === "RESULTS" && !path.endsWith("/create/result")) {
      router.replace("/(tabs)/analysis/create/result");
    }
  }, [state.value, path]);
}

export function AnalysisStateRouter() {
  useSyncRouteWithState();
  return null;
}

export default AnalysisStateRouter;
