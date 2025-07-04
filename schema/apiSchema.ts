
export interface ApiSampleFrame {
  id: string; 
  type: 'standard' | 'unknown';
  frames_base64: string[];
  concentration?: number;
  dilution_factor?: number;
  timestamps_sec?: number[];
}

export interface ReferenceProcessingRequest {
  dark_frames_base64: string[];
  white_frames_base64: string[];
  known_wavelengths_for_calibration?: number[];
}

export interface AnalysisRequest {
  analysisType: 'quantitative' | 'scan' | 'simple_read' | 'kinetic';
  dark_reference_spectrum: [number, number][];   
  white_reference_spectrum: [number, number][];  
  pixel_to_wavelength_coeffs: number[];
  samples: ApiSampleFrame[];
  target_wavelength?: number;
  scan_range?: [number, number];
  optical_path_cm?: number;
}

export interface ApiCalibrationCurve {
  r_squared: number;
  equation: string;
  slope: number;
  intercept: number;
}

export interface ApiSampleResult {
  sample_id: string;
  sample_absorbance?: number;
  calculated_concentration?: number;
  spectrum_data?: [number, number][]; 
  kinetic_data?: [number, number][];  
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
  dark_reference_spectrum?: [number, number][];
  white_reference_spectrum?: [number, number][];
  pixel_to_wavelength_coeffs?: number[];
  dark_current_std_dev?: number;
  error?: string;
}
