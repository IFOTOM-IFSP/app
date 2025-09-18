import { CalibrationCurve } from '@/models/CalibrationCurve';
import * as api from "@/services/analysisService";
import { CurveGraphData, FinalAnalysisResponse } from '@/services/analysisService';
import uriToBase64 from '@/utils/uriToBase64';
import { create } from 'zustand';
import { AnalysisSetupFormData, AnalysisStatus, CalibrationMeasurement } from '../models/analysis';
import { SpectrometerProfile } from '../models/SpectrometerProfile';

export interface DualBeamImages {
  sampleChannelUris: string[];
  referenceChannelUris: string[];
}

export interface StandardPoint {
  concentration: number;
  absorbance: number;
}

export type FinalResult = FinalAnalysisResponse['results'];

interface AnalysisState {
  setupData: AnalysisSetupFormData | null;
  calibrationMeasurements: CalibrationMeasurement[];
  newlyCalibratedProfile: SpectrometerProfile | null;
  status: AnalysisStatus;
  error: string | null;
  darkSignalImages: DualBeamImages | null;
  whiteSignalImages: DualBeamImages | null;
  standardPoints: StandardPoint[];
  newlyCreatedCurve: CalibrationCurve['coefficients'] | null;
  finalResult: FinalResult | null;
  graphData: CurveGraphData | null; 

  startAnalysis: (data: AnalysisSetupFormData) => void;
  addCalibrationMeasurement: (measurement: CalibrationMeasurement) => void;
  performCalibration: () => Promise<SpectrometerProfile | null>;
  resetAnalysis: () => void;
  setDarkSignalImages: (images: DualBeamImages) => void;
  setWhiteSignalImages: (images: DualBeamImages) => void;
  addStandardPoint: (point: StandardPoint) => void;
  calculateAbsorbanceForStandard: (
    data: {
      concentration: number;
      sampleImages: DualBeamImages;
      baseline: { dark: DualBeamImages; white: DualBeamImages };
      profile: SpectrometerProfile;
      wavelength: number;
    }
  ) => Promise<void>;
  fitCurve: () => Promise<CalibrationCurve['coefficients'] | null>;
  calculateFinalConcentration: (
      data: {
        sampleImages: DualBeamImages;
        baseline: { dark: DualBeamImages; white: DualBeamImages };
        profile: SpectrometerProfile;
        curve: CalibrationCurve['coefficients'];
        wavelength: number;
      }
    ) => Promise<void>;
}
export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  setupData: null,
  calibrationMeasurements: [],
  newlyCalibratedProfile: null,
  status: 'idle',
  error: null,
  darkSignalImages: null,
  whiteSignalImages: null,
  standardPoints: [],
  newlyCreatedCurve: null,
  finalResult: null,
  graphData: null,

  startAnalysis: (data) => {
    set({
      setupData: data,
      calibrationMeasurements: [],
      newlyCalibratedProfile: null,
      status: 'idle',
      error: null,
    });
  },

  addCalibrationMeasurement: (measurement) => {
    set((state) => ({
      calibrationMeasurements: [...state.calibrationMeasurements, measurement],
    }));
  },

  performCalibration: async () => {
    const measurements = get().calibrationMeasurements;
    if (measurements.length < 2) {
      set({ status: 'error', error: 'São necessárias medições de pelo menos dois lasers.' });
      return null;
    }

    set({ status: 'calibrating', error: null });

    try {
      const apiPayload = await Promise.all(
        measurements.map(async (m) => ({
          known_wavelength_nm: m.wavelengthNm,
          raw_images_base64: await Promise.all(m.imageUris.map(uri => uriToBase64(uri))),
        }))
      );
      
      const response = await api.calibrateSpectrometer({ laser_references: apiPayload });
      const profile = response.data.spectrometer_profile;

      set({ newlyCalibratedProfile: profile, status: 'success' });
      return profile;

    } catch (e: any) {
      console.error("Falha na calibração via API", e);
      set({ status: 'error', error: e.message || 'Erro desconhecido' });
      return null;
    }
  },

  setDarkSignalImages: (images) => set({ darkSignalImages: images, status: 'idle' }),
  setWhiteSignalImages: (images) => set({ whiteSignalImages: images, status: 'idle' }),
  addStandardPoint: (point) => set(state => ({ standardPoints: [...state.standardPoints, point] })),

  calculateAbsorbanceForStandard: async (data) => {
    set({ status: 'processing', error: null });
    try {
      const dark_signal_images_base64 = await Promise.all(data.baseline.dark.sampleChannelUris.map(uriToBase64));
      const reference_images_base64 = await Promise.all(data.baseline.white.sampleChannelUris.map(uriToBase64));
      const sample_images_base64 = await Promise.all(data.sampleImages.sampleChannelUris.map(uriToBase64));
      
      const response = await api.calculateAbsorbance({
        target_wavelength_nm: data.wavelength,
        spectrometer_profile: data.profile,
        measurement_data: { dark_signal_images_base64, reference_images_base64, sample_images_base64 }
      });

      const newPoint = {
        concentration: data.concentration,
        absorbance: response.data.results.mean_absorbance,
      };
      
      get().addStandardPoint(newPoint);
      set({ status: 'idle' });

    } catch (e: any) {
      set({ status: 'error', error: e.message });
    }
  },

  fitCurve: async () => {
    const points = get().standardPoints;
    if (points.length < 2) return null;

    set({ status: 'fitting_curve', error: null });
    try {
      const response = await api.fitCalibrationCurve({ standard_points: points });
      const coefficients = response.data.curve_coefficients;
      set({ status: 'success', newlyCreatedCurve: coefficients });
      return coefficients;
    } catch (e: any) {
      set({ status: 'error', error: e.message });
      return null;
    }
  },
  calculateFinalConcentration: async (data) => {
    set({ status: 'processing', error: null });
    try {
      // 1. Converter todas as imagens para Base64
      const dark_signal_images_base64 = await Promise.all(data.baseline.dark.sampleChannelUris.map(uriToBase64));
      const reference_images_base64 = await Promise.all(data.baseline.white.sampleChannelUris.map(uriToBase64));
      const sample_images_base64 = await Promise.all(data.sampleImages.sampleChannelUris.map(uriToBase64));

      // 2. Montar payload e chamar API
      const response = await api.getFinalResult({
        target_wavelength_nm: data.wavelength,
        spectrometer_profile: data.profile,
        calibration_curve: data.curve,
        measurement_data: {
          dark_signal_images_base64,
          reference_images_base64,
          sample_images_base64,
        },
      });

      // 3. Salvar o resultado final no estado
     set({ status: 'success', finalResult: response.data.results, graphData: response.data.graph_data });
    } catch (e: any) {
      set({ status: 'error', error: e.message });
    }
  },

  resetAnalysis: () => {
    set({
      setupData: null,
      calibrationMeasurements: [],
      newlyCalibratedProfile: null,
      darkSignalImages: null,
      whiteSignalImages: null,
      status: 'idle',
      error: null,
      finalResult: null,
      graphData: null,
    });
  },
}));

