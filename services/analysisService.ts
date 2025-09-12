import { CalibrationCurve } from '@/models/CalibrationCurve';
import axios from 'axios';
import { SpectrometerProfile } from '../models/SpectrometerProfile';

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

export const calibrateSpectrometer = (data: CalibrateRequest) => {
  return apiClient.post<CalibrateResponse>('/spectrometer/calibrate', data);
};

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

export const calculateAbsorbance = (data: AbsorbanceRequest) => {
  return apiClient.post<AbsorbanceResponse>('/analysis/quantitative', data);
};

interface FitCurveRequest {
  standard_points: {
    concentration: number;
    absorbance: number;
  }[];
}

interface FitCurveResponse {
  curve_coefficients: CalibrationCurve['coefficients']; 
}

export const fitCalibrationCurve = (data: FitCurveRequest) => {
  return apiClient.post<FitCurveResponse>('/calibration-curve/fit', data);
};

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

export const getFinalResult = (data: FinalAnalysisRequest) => {
  return apiClient.post<FinalAnalysisResponse>('/analysis/quantitative', data);
};

export interface CurveGraphData {
  calibration_points: {
    concentration: number;
    absorbance: number;
  }[];
  // Pontos para desenhar a linha da curva (muitos pontos entre min e max de concentração)
  curve_line_points: {
    concentration: number;
    absorbance: number;
  }[];
  sample_point: {
    concentration: number;
    absorbance: number;
  } | null;
}

// A resposta final agora usa a nova interface CurveGraphData
export interface FinalAnalysisResponse {
  results: {
    mean_absorbance: number;
    std_dev: number;
    coefficient_of_variation: number;
    final_concentration: number;
  };
  graph_data: CurveGraphData; // <<-- Tipo específico para os dados do gráfico
}