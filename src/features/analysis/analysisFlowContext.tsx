import { router } from "expo-router";
import { Alert } from "react-native";
import { create } from "zustand";

type AnalysisStep =
  | "idle"
  | "configuring"
  | "calibrating_wavelength"
  | "building_curve"
  | "capturing_base"
  | "measuring_sample"
  | "results";

interface AnalysisData {
  analysisType?: string;
  hasCalibratedSpectrometer?: boolean;
  hasDefinedCurve?: boolean;
  darkSignalImages?: any;
  whiteSignalImages?: any;
}

interface AnalysisFlowState {
  step: AnalysisStep;
  data: AnalysisData;
  startAnalysis: (analysisType: string) => void;
  handleConfigurationStep: () => void;
  updateData: (newData: Partial<AnalysisData>) => void;
}

export const useAnalysisFlowStore = create<AnalysisFlowState>((set, get) => ({
  step: "idle",
  data: {
    hasCalibratedSpectrometer: false,
    hasDefinedCurve: true,
  },

  updateData: (newData) => {
    set((state) => ({
      data: { ...state.data, ...newData },
    }));
  },

  startAnalysis: (analysisType) => {
    get().updateData({ analysisType });
    set({ step: "configuring" });

    router.push({
      pathname: "/analysis/[analysisFormsConfiguration]",
      params: { analysisFormsConfiguration: analysisType },
    });
  },

  handleConfigurationStep: () => {
    const { data } = get();

    if (!data.hasCalibratedSpectrometer) {
      set({ step: "calibrating_wavelength" });
      router.push("/analysis/wave_length_peak_setup");
      return;
    }

    if (!data.hasDefinedCurve) {
      set({ step: "building_curve" });
      router.push("/analysis/curve_builder");
      return;
    }

    if (data.darkSignalImages && data.whiteSignalImages) {
      Alert.alert(
        "Linha de Base Existente",
        "Deseja usá-la ou medir novamente?",
        [
          {
            text: "Usar Existente",
            onPress: () => {
              set({ step: "measuring_sample" });
              router.push("/analysis/measurement_sample");
            },
          },
          {
            text: "Medir Novamente",
            onPress: () => {
              set({ step: "capturing_base" });
              router.push("/analysis/capture_base");
            },
          },
        ]
      );
    } else {
      set({ step: "capturing_base" });
      router.push("/analysis/capture_base");
    }
  },
}));
