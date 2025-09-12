/*
 * ----------------------------------------------------------------------
 * Ficheiro: src/models/apiSchema.ts (Corrigido)
 * ----------------------------------------------------------------------
 * Define todas as interfaces e tipos para a comunicação com a API do back-end.
 */

// --- Tipos de Dados Fundamentais ---

export interface ApiSampleFrame {
  id: string; 
  type: 'standard' | 'unknown';
  frames_base64: string[];
  concentration?: number;
  dilution_factor?: number;
  timestamps_sec?: number[];
}

export type SpectrumPoint = [number, number];

// --- Estruturas de Requisição ---

export interface ReferenceProcessingRequest {
  dark_frames_base64: string[];
  white_frames_base64: string[];
  known_wavelengths_for_calibration?: number[];
}

export interface AnalysisRequest {
  analysisType: 'quantitative' | 'scan' | 'simple_read' | 'kinetic';
  dark_reference_spectrum: SpectrumPoint[];   
  white_reference_spectrum: SpectrumPoint[];  
  pixel_to_wavelength_coeffs: number[];
  samples: ApiSampleFrame[];
  target_wavelength?: number;
  scan_range?: [number, number];
  optical_path_cm?: number;
  calibration_curve?: {
    slope: number;
    intercept: number;
  };
}

// --- Estruturas de Resposta ---

export interface ApiCalibrationCurve {
  r_squared: number;
  equation: string;
  slope: number;
  intercept: number;
}

/**
 * O resultado processado para uma única amostra.
 * CORRIGIDO: Adicionadas as propriedades `type` e `concentration`.
 */
export interface ApiSampleResult {
  sample_id: string;
  type: 'standard' | 'unknown'; // Essencial para filtrar os resultados
  concentration?: number; // A concentração original para amostras padrão
  sample_absorbance?: number;
  calculated_concentration?: number; // A concentração calculada para amostras desconhecidas
  spectrum_data?: SpectrumPoint[]; 
}

export interface ApiAnalysisResult {
  calibration_curve?: ApiCalibrationCurve;
  sample_results: ApiSampleResult[]; 
}

export interface AnalysisResponse {
  status: 'success' | 'error';
  results?: ApiAnalysisResult;
  error?: string;
}

export interface ReferenceProcessingResponse {
  status: 'success' | 'error';
  dark_reference_spectrum?: SpectrumPoint[];
  white_reference_spectrum?: SpectrumPoint[];
  pixel_to_wavelength_coeffs?: number[];
  dark_current_std_dev?: number;
  error?: string;
}
