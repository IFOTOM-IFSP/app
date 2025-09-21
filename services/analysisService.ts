import { CalibrationCurve } from '@/src/models/CalibrationCurve';
import axios from 'axios';
import { SpectrometerProfile } from '../src/models/spectrometerProfile';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface CalibrateRequest {
  laser_references: {
    known_wavelength_nm: number;
    raw_images_base64: string[];
  }[];
}

interface CalibrateResponse {
  spectrometer_profile: SpectrometerProfile;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL, 
  headers: { 'Content-Type': 'application/json' },
});

// export const calibrateSpectrometer = (data: CalibrateRequest) => {
//   // return apiClient.post<CalibrateResponse>('/spectrometer/calibrate', data);
//   return 
// };

interface AbsorbanceRequest {
  target_wavelength_nm: number;
  measurement_data: {
    dark_signal_images_base64: string[];
    reference_images_base64: string[];
    sample_images_base64: string[];
  };
  spectrometer_profile: SpectrometerProfile;
}

interface AbsorbanceResponse {
  results: {
    mean_absorbance: number;
  };
}

// export const calculateAbsorbance = (data: AbsorbanceRequest) => {
//   return apiClient.post<AbsorbanceResponse>('/analysis/quantitative', data);
// };

interface FitCurveRequest {
  standard_points: {
    concentration: number;
    absorbance: number;
  }[];
}

interface FitCurveResponse {
  curve_coefficients: CalibrationCurve['coefficients']; 
}

// export const fitCalibrationCurve = (data: FitCurveRequest) => {
//   return apiClient.post<FitCurveResponse>('/calibration-curve/fit', data);
// };

interface FinalAnalysisRequest {
  target_wavelength_nm: number;
  measurement_data: {
    dark_signal_images_base64: string[];
    reference_images_base64: string[];
    sample_images_base64: string[];
  };
  spectrometer_profile: SpectrometerProfile;
  calibration_curve: CalibrationCurve['coefficients']; 
}

// export const getFinalResult = (data: FinalAnalysisRequest) => {
//   return apiClient.post<FinalAnalysisResponse>('/analysis/quantitative', data);
// };



const MOCK_PROFILE: SpectrometerProfile = {
  id: 'mock-profile-123',
  name: 'Perfil Calibrado (Mock)',
  calibrationDate: new Date().toISOString(),
  pixelToWavelengthMapping: {
    type: 'polynomial',
    coefficients: [-0.0001, 0.5, 400], // Coeficientes de exemplo
  },
};

const MOCK_CURVE: CalibrationCurve['coefficients'] = {
  slope_m: 1.25,
  intercept_b: 0.05,
  r_squared: 0.998,
};

// --- Interfaces (as mesmas de antes) ---

interface CalibrateRequest {
  laser_references: {
    known_wavelength_nm: number;
    raw_images_base64: string[];
  }[];
}

interface CalibrateResponse {
  spectrometer_profile: SpectrometerProfile;
}

interface AbsorbanceRequest {
  target_wavelength_nm: number;
  measurement_data: {
    dark_signal_images_base64: string[];
    reference_images_base64: string[];
    sample_images_base64: string[];
  };
  spectrometer_profile: SpectrometerProfile;
}

interface AbsorbanceResponse {
  results: {
    mean_absorbance: number;
  };
}

interface FitCurveRequest {
  standard_points: {
    concentration: number;
    absorbance: number;
  }[];
}

interface FitCurveResponse {
  curve_coefficients: CalibrationCurve['coefficients'];
}

export interface FinalResult {
    mean_absorbance: number;
    std_dev: number;
    coefficient_of_variation: number;
    final_concentration: number;
}

export interface CurveGraphData {
  calibration_points: {
    concentration: number;
    absorbance: number;
  }[];
  curve_line_points: {
    concentration: number;
    absorbance: number;
  }[];
  sample_point: {
    concentration: number;
    absorbance: number;
  } | null;
}

export interface FinalAnalysisResponse {
  results: FinalResult;
  graph_data: CurveGraphData;
}


export const calibrateSpectrometer = (data: CalibrateRequest): Promise<{ data: CalibrateResponse }> => {
  console.log('[MOCK API] Calibrando espectrômetro com:', data);
  return new Promise(resolve => setTimeout(() => resolve({ data: { spectrometer_profile: MOCK_PROFILE } }), 100));
};

export const calculateAbsorbance = (data: AbsorbanceRequest): Promise<{ data: AbsorbanceResponse }> => {
    console.log('[MOCK API] Calculando absorbância para padrão:', data);
    // Simula uma absorbância que aumenta com a concentração (se disponível)
    const mockAbsorbance = Math.random() * 0.1 + (data.target_wavelength_nm / 1000);
    return new Promise(resolve => setTimeout(() => resolve({ data: { results: { mean_absorbance: mockAbsorbance } } }), 100));
};

export const fitCalibrationCurve = (data: FitCurveRequest): Promise<{ data: FitCurveResponse }> => {
  console.log('[MOCK API] Ajustando curva com os pontos:', data);
  return new Promise(resolve => setTimeout(() => resolve({ data: { curve_coefficients: MOCK_CURVE } }), 1500));
};

export const getFinalResult = (data: any): Promise<{ data: FinalAnalysisResponse }> => {
  console.log('[MOCK API] Obtendo resultado final com:', data);
  const final_concentration = (Math.random() * 0.5) + 0.1;
  const mean_absorbance = final_concentration * MOCK_CURVE.slope_m + MOCK_CURVE.intercept_b;

  const mockResponse: FinalAnalysisResponse = {
    results: {
      mean_absorbance,
      std_dev: Math.random() * 0.01,
      coefficient_of_variation: Math.random() * 2,
      final_concentration,
    },
    graph_data: {
      calibration_points: [], // Em uma implementação real, viriam do request
      curve_line_points: [
          { concentration: 0, absorbance: MOCK_CURVE.intercept_b },
          { concentration: 1, absorbance: MOCK_CURVE.slope_m + MOCK_CURVE.intercept_b },
      ],
      sample_point: {
        concentration: final_concentration,
        absorbance: mean_absorbance,
      },
    },
  };
  return new Promise(resolve => setTimeout(() => resolve({ data: mockResponse }), 2000));
};