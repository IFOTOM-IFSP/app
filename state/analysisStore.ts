import { AnalysisSetup, AnalysisStep, SampleData } from '@/schema/analysisSchema';
import {
  AnalysisRequest,
  ApiAnalysisResult,
  ApiSampleFrame,
  ReferenceProcessingRequest,
  ReferenceProcessingResponse
} from '@/schema/apiSchema';
import { processReferences, runAnalysis } from '@/service/apiService';
import { saveAnalysis } from '@/storage/analysisStorage';
import uriToBase64 from '@/utils/uriToBase64';
import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';

// Interface de Notificação Melhorada
export interface UiNotification {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AnalysisState {
  currentStep: AnalysisStep;
  uiNotification: UiNotification | null;
  sessionData: {
    setup: AnalysisSetup | null;
    darkFrameUris: string[];
    whiteFrameUris: string[];
    samples: SampleData[];
    processedDarkSpectrum: [number, number][] | null;
    processedWhiteSpectrum: [number, number][] | null;
    wavelengthCoeffs: number[] | null;
    result: ApiAnalysisResult | null;
    // ALTERADO: Adicionado para guardar o ID da análise para navegação.
    savedAnalysisId: number | null;
    error: string | null;
  };
  actions: {
    startAnalysis: (setup: AnalysisSetup) => void;
    // ALTERADO: A ação agora aceita o objeto SampleData completo.
    addCapturedSample: (sample: SampleData) => void;
    removeCapturedSample: (sampleIdToRemove: string) => void;
    processAndCacheReferences: (darkUris: string[], whiteUris: string[]) => Promise<void>;
    calculateCalibrationCurve: () => Promise<void>;
    runFinalAnalysis: () => Promise<void>;
    resetAnalysis: () => void;
    showUiNotification: (notification: UiNotification) => void;
    dismissUiNotification: () => void;
  };
}

const initialState: Omit<AnalysisState, 'actions'> = {
  currentStep: 'setup',
  uiNotification: null,
  sessionData: {
    setup: null,
    darkFrameUris: [],
    whiteFrameUris: [],
    samples: [],
    processedDarkSpectrum: null,
    processedWhiteSpectrum: null,
    wavelengthCoeffs: null,
    result: null,
    // ALTERADO: Adicionado ao estado inicial.
    savedAnalysisId: null,
    error: null,
  },
};


const buildBaseAnalysisRequest = (sessionData: AnalysisState['sessionData']): Omit<AnalysisRequest, 'samples'> => {
  const { setup, processedDarkSpectrum, processedWhiteSpectrum, wavelengthCoeffs } = sessionData;
  if (!setup || !processedDarkSpectrum || !processedWhiteSpectrum || !wavelengthCoeffs) {
    throw new Error("Dados de sessão essenciais em falta para construir o pedido.");
  }

  const basePayload = {
    analysisType: setup.analysisType,
    dark_reference_spectrum: processedDarkSpectrum,
    white_reference_spectrum: processedWhiteSpectrum,
    pixel_to_wavelength_coeffs: wavelengthCoeffs,
    optical_path_cm: setup.opticalPath,
  };

  switch (setup.analysisType) {
    case 'quantitative':
    case 'simple_read':
    case 'kinetic':
      return {
        ...basePayload,
        target_wavelength: setup.targetWavelength,
        scan_range: undefined, 
      };
    
    case 'scan':
      return {
        ...basePayload,
        scan_range: [setup.startWavelength, setup.endWavelength],
        target_wavelength: undefined, 
      };
  }
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  ...initialState,
  actions: {
    startAnalysis: (setup) => set({ currentStep: 'dark_frame', sessionData: { ...initialState.sessionData, setup } }),
    
    addCapturedSample: (newSampleWithId) => {
        set((state) => ({
            sessionData: {
                ...state.sessionData,
                samples: [...state.sessionData.samples, newSampleWithId]
            }
        }));
    },

    removeCapturedSample: (sampleIdToRemove) => set(state => ({
        sessionData: {
            ...state.sessionData,
            samples: state.sessionData.samples.filter(s => s.id !== sampleIdToRemove)
        }
    })),

    processAndCacheReferences: async (darkUris: string[], whiteUris: string[]) => {
      if (!darkUris.length || !whiteUris.length) {
          const errorMessage = "Dados de referência (escuro ou branco) estão em falta.";
          set(state => ({ currentStep: 'error', sessionData: { ...state.sessionData, error: errorMessage } }));
          get().actions.showUiNotification({ title: "Erro de Dados", message: errorMessage, type: 'error' });
          return;
      }
      
      set({ currentStep: 'processing_references' });

      set(state => ({
        sessionData: { ...state.sessionData, darkFrameUris: darkUris, whiteFrameUris: whiteUris }
      }));

      try {
          const payload: ReferenceProcessingRequest = {
              dark_frames_base64: await Promise.all(darkUris.map(uriToBase64)),
              white_frames_base64: await Promise.all(whiteUris.map(uriToBase64)),
          };
          
          const response: ReferenceProcessingResponse = await processReferences(payload);

          if (response.status === 'success') {
              if (response.dark_current_std_dev !== undefined) {
                  useSettingsStore.getState().actions.setNoiseMetric(response.dark_current_std_dev);
              }
              set((state) => {
                  const { setup } = state.sessionData;
                  let nextStep: AnalysisStep = 'sample_capture';
                  if (setup?.analysisType === 'quantitative' && !setup.useCalibrationCurve) {
                      nextStep = 'calibration_standards_capture';
                  }
                  return {
                      sessionData: {
                          ...state.sessionData,
                          processedDarkSpectrum: response.dark_reference_spectrum ?? null,
                          processedWhiteSpectrum: response.white_reference_spectrum ?? null,
                          wavelengthCoeffs: response.pixel_to_wavelength_coeffs ?? null
                      },
                      currentStep: nextStep,
                  };
              });
          } else {
              throw new Error(response.error || "A API falhou ao processar as referências.");
          }
      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
          set(state => ({ currentStep: 'error', sessionData: { ...state.sessionData, error: errorMessage } }));
          get().actions.showUiNotification({ title: "Erro no Processamento", message: errorMessage, type: 'error' });
      }
    },

    calculateCalibrationCurve: async () => {
        const { sessionData, actions } = get();
        const standards = sessionData.samples.filter(s => s.type === 'standard');
        
        if (standards.length < 2) {
            actions.showUiNotification({
                title: "Dados insuficientes",
                message: "São necessários pelo menos 2 padrões para calcular a curva de calibração.",
                type: 'warning',
            });
            return;
        }

        set({ currentStep: 'processing_curve' });
        try {
            const basePayload = buildBaseAnalysisRequest(sessionData);

            const apiSamples: ApiSampleFrame[] = await Promise.all(
                standards.map(async (s) => ({
                    id: s.id, type: s.type, concentration: s.concentration,
                    frames_base64: await Promise.all(s.uris.map(uriToBase64)),
                }))
            );

            const payload: AnalysisRequest = { ...basePayload, analysisType: 'quantitative', samples: apiSamples };
            const response = await runAnalysis(payload);

            if (response.status === 'success' && response.results?.calibration_curve) {
                set(state => {
                    const updatedResult: ApiAnalysisResult = {
                        ...(state.sessionData.result as ApiAnalysisResult ?? {}),
                        sample_results: state.sessionData.result?.sample_results ?? [],
                        calibration_curve: response.results!.calibration_curve,
                    };
                    return {
                        currentStep: 'calibration_standards_capture',
                        sessionData: { ...state.sessionData, result: updatedResult }
                    };
                });
                actions.showUiNotification({ title: "Sucesso", message: "Curva de calibração calculada!", type: 'success' });
            } else {
                throw new Error(response.error || "A API falhou ao calcular a curva de calibração.");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
            set(state => ({ currentStep: 'error', sessionData: { ...state.sessionData, error: errorMessage } }));
            actions.showUiNotification({ title: "Erro na Curva", message: errorMessage, type: 'error' });
        }
    },

   runFinalAnalysis: async () => {
        const { sessionData, actions } = get();
        set({ currentStep: 'processing_final' });
        try {
            const basePayload = buildBaseAnalysisRequest(sessionData);

            const apiSamples: ApiSampleFrame[] = await Promise.all(
                sessionData.samples.map(async (s) => ({
                    id: s.id, type: s.type, concentration: s.concentration, dilution_factor: s.dilution_factor, timestamps_sec: s.timestamps_sec,
                    frames_base64: await Promise.all(s.uris.map(uriToBase64)),
                }))
            );

            const payload: AnalysisRequest = { ...basePayload, samples: apiSamples };
            const response = await runAnalysis(payload);

            if (response.status === 'success' && response.results) {
                const apiResult: ApiAnalysisResult = response.results;

          
                const newId = (await saveAnalysis({
                    createdAt: new Date().toISOString(),
                    analysisSetup: sessionData.setup!,
                    analysisResult: apiResult, 
                })) as number;
                
                set(state => ({
                    currentStep: 'results',
                    sessionData: { 
                        ...state.sessionData, 
                        result: apiResult,
                        savedAnalysisId: newId,
                    }
                }));

                actions.showUiNotification({ title: "Análise Concluída", message: "Resultados guardados no histórico.", type: 'success' });

            } else {
                throw new Error(response.error || "A API falhou na análise final.");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
            set(state => ({ currentStep: 'error', sessionData: { ...state.sessionData, error: errorMessage } }));
            actions.showUiNotification({ title: "Erro na Análise", message: errorMessage, type: 'error' });
        }
    },

    resetAnalysis: () => set(initialState),
    
    showUiNotification: (notification) => set({ uiNotification: notification }),
    dismissUiNotification: () => set({ uiNotification: null }),
  },
}));
export const useAnalysisActions = () => useAnalysisStore((state) => state.actions);
