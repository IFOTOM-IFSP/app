import { router } from "expo-router";
import { Alert } from "react-native";
import { create } from "zustand";

import { useBaselineStore } from "@/store/baselineStore";

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
}

interface AnalysisFlowState {
  step: AnalysisStep;
  data: AnalysisData;
  actions: {
    startAnalysis: (analysisType: string) => void;
    handleConfigurationStep: (configData: Partial<AnalysisData>) => void;
    updateData: (newData: Partial<AnalysisData>) => void;
    completeWavelengthCalibration: () => void;
    completeCurveBuilding: () => void;
    completeBaselineCapture: () => void;
    navigateToResults: () => void;
    resetFlow: () => void;
  };
}

export const useAnalysisFlowStore = create<AnalysisFlowState>((set, get) => ({
  step: "idle",
  data: {},
  actions: {
    startAnalysis: (analysisType) => {
      get().actions.resetFlow();
      get().actions.updateData({ analysisType });
      set({ step: "configuring" });
      router.navigate({
        pathname: "/(tabs)/analysis/create/[analysisFormId]",
        params: { analysisFormId: analysisType },
      });
    },

    updateData: (newData) => {
      set((state) => ({
        data: { ...state.data, ...newData },
      }));
    },

    handleConfigurationStep: (configData) => {
      get().actions.updateData(configData);
      const { data } = get();

      if (!data.hasCalibratedSpectrometer) {
        set({ step: "calibrating_wavelength" });
        router.push("/(tabs)/analysis/create/calibrate");
        return;
      }
      get().actions.completeWavelengthCalibration();
    },

    completeWavelengthCalibration: () => {
      get().actions.updateData({ hasCalibratedSpectrometer: true });
      const { data } = get();

      if (!data.hasDefinedCurve) {
        set({ step: "building_curve" });
        router.push("/(tabs)/analysis/create/build-curve");
        return;
      }
      get().actions.completeCurveBuilding();
    },

    completeCurveBuilding: () => {
      get().actions.updateData({ hasDefinedCurve: true });
      const { darkSignalImages, whiteSignalImages } =
        useBaselineStore.getState();

      if (darkSignalImages && whiteSignalImages) {
        Alert.alert(
          "Linha de Base Existente",
          "Deseja usá-la ou medir novamente?",
          [
            {
              text: "Usar Existente",
              onPress: () => {
                set({ step: "measuring_sample" });
                router.push("/(tabs)/analysis/create/measure");
              },
            },
            {
              text: "Medir Novamente",
              onPress: () => {
                set({ step: "capturing_base" });
                router.push("/(tabs)/analysis/create/baseline");
              },
            },
          ]
        );
      } else {
        set({ step: "capturing_base" });
        router.push("/(tabs)/analysis/create/baseline");
      }
    },

    completeBaselineCapture: () => {
      set({ step: "measuring_sample" });
      router.push("/(tabs)/analysis/create/measure");
    },

    navigateToResults: () => {
      set({ step: "results" });
      router.push("/(tabs)/analysis/view/results");
    },
    resetFlow: () => {
      set({ step: "idle", data: {} });
    },
  },
}));

export const useAnalysisFlowState = () =>
  useAnalysisFlowStore((state) => ({ step: state.step, data: state.data }));
export const useAnalysisFlowActions = () =>
  useAnalysisFlowStore((state) => state.actions);
