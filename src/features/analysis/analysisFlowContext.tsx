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
    /**
     * Reseta o fluxo e inicia uma nova análise, navegando para a tela de configuração.
     */
    startAnalysis: (analysisType) => {
      get().actions.resetFlow();
      get().actions.updateData({ analysisType });
      set({ step: "configuring" });
      router.push({
        pathname: "/(tabs)/analysis/create/[analysisFormId]",
        params: { analysisFormId: analysisType },
      });
    },

    /**
     * Atualiza o estado interno do fluxo com novos dados.
     */
    updateData: (newData) => {
      set((state) => ({
        data: { ...state.data, ...newData },
      }));
    },

    /**
     * Chamado após o formulário de configuração ser preenchido.
     * Decide qual é a primeira etapa do fluxo.
     */
    handleConfigurationStep: (configData) => {
      get().actions.updateData(configData);
      const { data } = get();

      if (!data.hasCalibratedSpectrometer) {
        set({ step: "calibrating_wavelength" });
        router.push("/(tabs)/analysis/create/calibrate");
        return;
      }
      // Se já está calibrado, pula para a próxima verificação
      get().actions.completeWavelengthCalibration();
    },

    /**
     * Chamado quando a etapa de calibração do espectrômetro é concluída.
     */
    completeWavelengthCalibration: () => {
      get().actions.updateData({ hasCalibratedSpectrometer: true });
      const { data } = get();

      if (!data.hasDefinedCurve) {
        set({ step: "building_curve" });
        router.push("/(tabs)/analysis/create/build-curve");
        return;
      }
      // Se a curva já existe, pula para a próxima verificação
      get().actions.completeCurveBuilding();
    },

    /**
     * Chamado quando a etapa de construção de curva é concluída.
     */
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

    /**
     * Chamado quando a captura da linha de base (branco/escuro) é concluída.
     */
    completeBaselineCapture: () => {
      set({ step: "measuring_sample" });
      router.push("/(tabs)/analysis/create/measure");
    },

    /**
     * Navega para a tela final de resultados.
     */
    navigateToResults: () => {
      set({ step: "results" });
      // Assumindo que você criará uma tela de resultados em /create/results.tsx
      router.push("/(tabs)/analysis/view/results");
    },

    /**
     * Limpa o estado do fluxo para uma nova análise.
     */
    resetFlow: () => {
      set({ step: "idle", data: {} });
    },
  },
}));

// Hooks para facilitar o uso no restante do aplicativo
export const useAnalysisFlowState = () =>
  useAnalysisFlowStore((state) => ({ step: state.step, data: state.data }));
export const useAnalysisFlowActions = () =>
  useAnalysisFlowStore((state) => state.actions);
