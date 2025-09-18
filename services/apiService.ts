import {
  AnalysisRequest,
  AnalysisResponse,
  ReferenceProcessingRequest,
  ReferenceProcessingResponse
} from '@/models';
import { ApiError, handleError } from '@/services/errorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

async function processReferences(
  darkFramesBase64: string[],
  whiteFramesBase64: string[]
): Promise<ReferenceProcessingResponse> {
  const endpoint = `${API_BASE_URL}/process-references`;
  const body: ReferenceProcessingRequest = {
    dark_frames_base64: darkFramesBase64,
    white_frames_base64: whiteFramesBase64,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });

    const data: ReferenceProcessingResponse = await response.json();

    if (!response.ok || data.status === 'error') {
      throw new ApiError(data.error || 'Falha ao processar as referências.', response.status);
    }

    return data;
  } catch (error) {
    handleError(error, 'apiService:processReferences');
    throw error;
  }
}

async function runAnalysis(command: AnalysisRequest): Promise<AnalysisResponse> {
  const endpoint = `${API_BASE_URL}/analyze`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(command),
    });

    const data: AnalysisResponse = await response.json();

    if (!response.ok || data.status === 'error') {
      throw new ApiError(data.error || `Falha na análise do tipo '${command.analysisType}'.`, response.status);
    }

    return data;
  } catch (error) {
    handleError(error, 'apiService:runAnalysis', { analysisType: command.analysisType });
    throw error;
  }
}

export const apiService = {
  processReferences,
  runAnalysis,
};
