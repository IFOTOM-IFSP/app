/*
 * ----------------------------------------------------------------------
 * Ficheiro: src/hooks/useQuantitativeAnalysis.ts (Refatorado)
 * ----------------------------------------------------------------------
 * Maestro refatorado para gerir as curvas de calibração no lado do cliente.
 */
import type {
  AnalysisRequest,
  AnalysisResponse,
  ApiSampleFrame,
  ReferenceProcessingResponse
} from '@/models/apiSchema';
import { apiService } from '@/services/apiService';
import { handleError } from '@/services/errorHandler';
import { useCalibrationActions } from '@/state/calibrationStore';
import type { CalibrationCurve } from '@/storage/calibrationStorage';
import { useCallback, useState } from 'react';


export type AnalysisStatus = 
  | 'idle'                // Estado inicial
  | 'calibrating'         // A processar as referências
  | 'collectingSamples'   // À espera que o utilizador adicione as amostras
  | 'analyzing'           // A enviar o comando final
  | 'success'             // Análise concluída
  | 'error';              

type ReferenceData = Omit<ReferenceProcessingResponse, 'status' | 'error'>;

export interface UseQuantitativeAnalysisReturn {
  status: AnalysisStatus;
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResponse | null;

  processReferenceFrames: (darkFrames: string[], whiteFrames: string[]) => Promise<void>;

  runFinalAnalysis: (
    samples: ApiSampleFrame[],
    options: {
      targetWavelength: number;
      existingCurve?: CalibrationCurve;
    }
  ) => Promise<void>;

  reset: () => void;
}


export function useQuantitativeAnalysis(): UseQuantitativeAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  const { addCurve } = useCalibrationActions();

  const processReferenceFrames = useCallback(async (darkFrames: string[], whiteFrames: string[]) => {
    setIsLoading(true);
    setError(null);
    setStatus('calibrating');

    try {
      const response = await apiService.processReferences(darkFrames, whiteFrames);
      setReferenceData({
        dark_reference_spectrum: response.dark_reference_spectrum,
        white_reference_spectrum: response.white_reference_spectrum,
        pixel_to_wavelength_coeffs: response.pixel_to_wavelength_coeffs,
      });
      setStatus('collectingSamples'); 
    } catch (err) {
      setError('Falha ao calibrar as referências. Por favor, tente novamente.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runFinalAnalysis = useCallback(async (
    samples: ApiSampleFrame[],
    options: { targetWavelength: number; existingCurve?: CalibrationCurve }
  ) => {
    if (!referenceData?.dark_reference_spectrum || !referenceData?.white_reference_spectrum) {
      const errMessage = 'Dados de referência em falta. Execute a calibração primeiro.';
      setError(errMessage);
      setStatus('error');
      handleError(new Error(errMessage), 'useQuantitativeAnalysis:runFinalAnalysis');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus('analyzing');

    try {
      const command: AnalysisRequest = {
        analysisType: 'quantitative',
        dark_reference_spectrum: referenceData.dark_reference_spectrum,
        white_reference_spectrum: referenceData.white_reference_spectrum,
        pixel_to_wavelength_coeffs: referenceData.pixel_to_wavelength_coeffs || [],
        samples: samples,
        target_wavelength: options.targetWavelength,
        calibration_curve: options.existingCurve 
          ? { slope: options.existingCurve.slope, intercept: options.existingCurve.intercept }
          : undefined,
      };

      const result = await apiService.runAnalysis(command);
      setAnalysisResult(result);

      if (!options.existingCurve && result.results?.calibration_curve) {
        await addCurve({
          name: `Curva de ${new Date().toLocaleDateString()}`,
          slope: result.results.calibration_curve.slope,
          intercept: result.results.calibration_curve.intercept,
          rSquared: result.results.calibration_curve.r_squared,
        });
      }
      
      setStatus('success');
    } catch (err) {
      setError('Falha ao executar a análise.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [referenceData, addCurve]); 

  const reset = useCallback(() => {
    setStatus('idle');
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
    setReferenceData(null);
  }, []);

  return {
    status,
    isLoading,
    error,
    analysisResult,
    processReferenceFrames,
    runFinalAnalysis,
    reset,
  };
}
