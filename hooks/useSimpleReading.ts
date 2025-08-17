
import { useState, useCallback } from 'react';
import { apiService } from '@/services/apiService';
import { handleError } from '@/services/errorHandler';
import type { 
  ApiSampleFrame, 
  AnalysisResponse, 
  ReferenceProcessingResponse, 
  AnalysisRequest 
} from '@/models/apiSchema';

export type SimpleReadingStatus = 
  | 'idle'               
  | 'calibrating'         
  | 'capturingSample'     
  | 'analyzing'           
  | 'success'            
  | 'error';              

type ReferenceData = Omit<ReferenceProcessingResponse, 'status' | 'error'>;

export interface UseSimpleReadingReturn {
  status: SimpleReadingStatus;
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResponse | null;
  startAnalysis: (darkFrames: string[], whiteFrames: string[], sampleFrame: string) => Promise<void>;
  reset: () => void;
}

export function useSimpleReading(): UseSimpleReadingReturn {
  const [status, setStatus] = useState<SimpleReadingStatus>('idle');
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
        analysisType: 'simple_read',
        dark_reference_spectrum: refData.dark_reference_spectrum,
        white_reference_spectrum: refData.white_reference_spectrum,
        pixel_to_wavelength_coeffs: refData.pixel_to_wavelength_coeffs || [],
        samples: [
          { 
            id: 'unknown_sample',
            type: 'unknown', 
            frames_base64: [sampleFrame] 
          }
        ],
      };

      const result = await apiService.runAnalysis(command);
      
      setAnalysisResult(result);
      setStatus('success');

    } catch (err) {
      setError('Ocorreu um erro durante a análise. Por favor, tente novamente.');
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
