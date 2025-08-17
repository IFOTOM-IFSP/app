import type {
  AnalysisRequest,
  AnalysisResponse,
  ApiSampleFrame,
  ReferenceProcessingResponse
} from '@/models/apiSchema';
import { apiService } from '@/services/apiService';
import { handleError } from '@/services/errorHandler';
import { useCallback, useEffect, useRef, useState } from 'react';



export type KineticAnalysisStatus = 
  | 'configuring'       
  | 'idle'               
  | 'calibrating'         
  | 'running'             
  | 'analyzing'           
  | 'success'         
  | 'error';              

export interface KineticConfig {
  interval: number; 
  duration: number; 
}

export type FrameCaptureFn = () => Promise<string>;

interface TimedFrame {
  timestamp_sec: number;
  frame_base64: string;
}

type ReferenceData = Omit<ReferenceProcessingResponse, 'status' | 'error'>;

export interface UseKineticAnalysisReturn {
  status: KineticAnalysisStatus;
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResponse | null;
  elapsedTime: number;
  config: KineticConfig;
  setConfig: (newConfig: Partial<KineticConfig>) => void;
  startAnalysis: (darkFrames: string[], whiteFrames: string[], captureFrame: FrameCaptureFn) => Promise<void>;
  stopAnalysis: () => void;
  reset: () => void;
}


export function useKineticAnalysis(): UseKineticAnalysisReturn {
  const [status, setStatus] = useState<KineticAnalysisStatus>('configuring');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  
  const [config, setConfigState] = useState<KineticConfig>({ interval: 5, duration: 60 });
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const collectedFramesRef = useRef<TimedFrame[]>([]);
  const referenceDataRef = useRef<ReferenceData | null>(null);

  const processCollectedFrames = useCallback(async () => {
    if (!referenceDataRef.current) {
      setStatus('error');
      setError('Dados de referência em falta.');
      return;
    }
    
    setStatus('analyzing');
    setIsLoading(true);

    try {
      const command: AnalysisRequest = {
        analysisType: 'kinetic',
        dark_reference_spectrum: referenceDataRef.current.dark_reference_spectrum || [],
        white_reference_spectrum: referenceDataRef.current.white_reference_spectrum || [],
        pixel_to_wavelength_coeffs: referenceDataRef.current.pixel_to_wavelength_coeffs || [],
        samples: [{
          id: 'kinetic_run',
          type: 'unknown',
          frames_base64: collectedFramesRef.current.map(f => f.frame_base64),
          timestamps_sec: collectedFramesRef.current.map(f => f.timestamp_sec),
        } as ApiSampleFrame],
      };

      const result = await apiService.runAnalysis(command);
      setAnalysisResult(result);
      setStatus('success');
    } catch (err) {
      setError('Falha ao processar a análise cinética.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopAnalysis = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (status === 'running') {
      processCollectedFrames();
    }
  }, [status, processCollectedFrames]);

  const startAnalysis = useCallback(async (
    darkFrames: string[], 
    whiteFrames: string[], 
    captureFrame: FrameCaptureFn
  ) => {
    setIsLoading(true);
    setError(null);
    setElapsedTime(0);
    collectedFramesRef.current = [];
    
    try {
      setStatus('calibrating');
      const refData = await apiService.processReferences(darkFrames, whiteFrames);
      referenceDataRef.current = refData;
      
      setStatus('running');
      setIsLoading(false);
      
      const startTime = Date.now();
      
      timerRef.current = setInterval(async () => {
        const currentElapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentElapsedTime);

        if (currentElapsedTime >= config.duration) {
          stopAnalysis();
          return;
        }

        try {
          const frame = await captureFrame();
          collectedFramesRef.current.push({
            timestamp_sec: currentElapsedTime,
            frame_base64: frame,
          });
        } catch (captureError) {
          handleError(captureError, 'useKineticAnalysis:frameCapture');
          setError('Falha ao capturar uma imagem.');
          setStatus('error');
          stopAnalysis();
        }
      }, config.interval * 1000);

    } catch (err) {
      setError('Falha na calibração de referência.');
      setStatus('error');
      setIsLoading(false);
    }
  }, [config, stopAnalysis]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    referenceDataRef.current = null;
    collectedFramesRef.current = [];
    setStatus('configuring');
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
    setElapsedTime(0);
  }, []);

  const setConfig = useCallback((newConfig: Partial<KineticConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
    setStatus('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    status,
    isLoading,
    error,
    analysisResult,
    elapsedTime,
    config,
    setConfig,
    startAnalysis,
    stopAnalysis,
    reset,
  };
}
