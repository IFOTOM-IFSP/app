// app/analysis/AnalysisStateRouter.tsx
import { router } from "expo-router";
import { useEffect } from "react";
import { useAnalysisMachine } from "./AnalysisMachineProvider";

export default function AnalysisStateRouter() {
  const { state } = useAnalysisMachine();

  useEffect(() => {
    const v = state.value;
    // mapeamento de estado → rota
    if (v === "CHOOSE_TYPE") router.replace("/analysis/start");
    else if (v === "PARAMS") router.replace("/analysis/params");
    else if (v === "PREFLIGHT") router.replace("/analysis/preflight");
    else if (v === "CALIB_DEVICE") router.replace("/analysis/calibrate");
    else if (v === "CALIB_CURVE" || v === "BUILD_CURVE")
      router.replace("/analysis/standards");
    else if (
      v === "ACQ_DARK_NOISE" ||
      v === "ACQ_WHITE_NOISE" ||
      v === "ACQ_REF1" ||
      v === "ACQ_SAMPLE" ||
      v === "ACQ_REF2"
    ) {
      router.replace("/analysis/acquire");
    } else if (v === "PROCESSING") router.replace("/analysis/processing");
    else if (v === "RESULTS") router.replace("/analysis/results");
    else if (v === "QA_SAVE") router.replace("/analysis/qa");
    else if (v === "DONE") router.replace("/analysis/done");
  }, [state.value]);

  return null; // nada a renderizar, só roteia
}
