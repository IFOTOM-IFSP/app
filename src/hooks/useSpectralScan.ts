import type {
  AnalysisRequest,
  AnalysisResponse
} from '@/src/models/apiSchema';
import { apiService } from '@/services/http';
import { useCallback, useState } from 'react';



export type SpectralScanStatus = 
  | 'idle'                
  | 'calibrating'         
  | 'capturingSample'     
  | 'analyzing'           
  | 'success'             
  | 'error';              

export interface UseSpectralScanReturn {
  status: SpectralScanStatus;
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResponse | null;
  startAnalysis: (darkFrames: string[], whiteFrames: string[], sampleFrame: string) => Promise<void>;
  reset: () => void;
}


export function useSpectralScan(): UseSpectralScanReturn {
  const [status, setStatus] = useState<SpectralScanStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  const startAnalysis = useCallback(async (
    darkFrames: string[], 
    whiteFrames: string[], 
    sampleFrame: string
  ) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      setStatus('calibrating');
      const refData = await apiService.processReferences(darkFrames, whiteFrames);
      
      if (!refData.dark_reference_spectrum || !refData.white_reference_spectrum) {
        throw new Error("A resposta da calibração de referência está incompleta.");
      }

      setStatus('analyzing');
      const command: AnalysisRequest = {
        analysisType: 'scan', 
        dark_reference_spectrum: refData.dark_reference_spectrum,
        white_reference_spectrum: refData.white_reference_spectrum,
        pixel_to_wavelength_coeffs: refData.pixel_to_wavelength_coeffs || [],
        samples: [
          { 
            id: 'unknown_sample_scan',
            type: 'unknown', 
            frames_base64: [sampleFrame] 
          }
        ],
      };

      const result = await apiService.runAnalysis(command);
      
      setAnalysisResult(result);
      setStatus('success');

    } catch (err) {
      setError('Ocorreu um erro durante a varredura espectral. Por favor, tente novamente.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
  }, []);

  return {
    status,
    isLoading,
    error,
    analysisResult,
    startAnalysis,
    reset,
  };
}
