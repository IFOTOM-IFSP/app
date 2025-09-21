import type { QuantAnalyzeResponse } from '@/types/api';
import type { AnalysisParams, DeviceProfile } from '@/types/types';

export type AnalysisReport = {
  id: string;                 // uuid/string
  savedAt: string;            // ISO string (para o History sort)
  setupData: {
    name: string;
    substance?: string;
    params: AnalysisParams;
    device_hash?: string;
    source?: 'api' | 'local'; 
  };
  deviceProfileSnapshot?: Partial<DeviceProfile>;
  results: QuantAnalyzeResponse;
};


export function toSavedAnalysis(report: AnalysisReport) {
  return {
    id: report.id,
    ts: new Date(report.savedAt).getTime(),
    name: report.setupData.name,
    params: report.setupData.params,
    device_hash: report.setupData.device_hash,
    source: report.setupData.source,
    results: report.results,
  };
}

export type CalibrationMeasurement = {
  laserName: string;      // "Laser Verde", "LED 650nm", etc.
  wavelengthNm: number;   // comprimento de onda conhecido (nm)
  imageUris: string[];    // burst de imagens capturadas
};