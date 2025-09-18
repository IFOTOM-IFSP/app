import { AnalysisReport } from '@/models/analysis';
import { CalibrationCurve } from '@/models/CalibrationCurve';
import { DualBeamImages } from '@/store/analysisStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { SpectrometerProfile } from '../models/SpectrometerProfile';

const PROFILES_KEY = 'spectrometer_profiles';
const CURVES_KEY = 'calibration_curves';
const BASELINE_KEY = 'session_baseline_images';

interface BaselineData {
  darkSignalImages: DualBeamImages;
  whiteSignalImages: DualBeamImages;
  timestamp: number; 
}


export const loadProfiles = async (): Promise<SpectrometerProfile[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PROFILES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load profiles.", e);

    return [];
  }
};

export const saveProfiles = async (profiles: SpectrometerProfile[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(profiles);
    await AsyncStorage.setItem(PROFILES_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save profiles.", e);
  }
};

export const loadCurves = async (): Promise<CalibrationCurve[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CURVES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load curves.", e);
    return [];
  }
};

export const saveCurves = async (curves: CalibrationCurve[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(curves);
    await AsyncStorage.setItem(CURVES_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save curves.", e);
  }
};

export const saveBaseline = async (data: BaselineData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(BASELINE_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save baseline.", e);
  }
};

export const loadBaseline = async (): Promise<BaselineData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BASELINE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load baseline.", e);
    return null;
  }
};

export const clearBaseline = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BASELINE_KEY);
  } catch (e) {
    console.error("Failed to clear baseline.", e);
  }
};

const reportsDir = FileSystem.documentDirectory + 'analysis_reports/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(reportsDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(reportsDir, { intermediates: true });
  }
};

// Salva um relatório de análise completo como um arquivo JSON
export const saveAnalysisReport = async (report: AnalysisReport): Promise<void> => {
  await ensureDirExists();
  const fileUri = reportsDir + `report-${report.id}.json`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(report, null, 2));
};

// Carrega a lista de resumos de relatórios para a tela de histórico
export const getHistoryList = async (): Promise<Pick<AnalysisReport, 'id' | 'setupData' | 'savedAt'>[]> => {
  await ensureDirExists();
  const files = await FileSystem.readDirectoryAsync(reportsDir);
  const reports = [];
  for (const file of files) {
    const fileUri = reportsDir + file;
    const content = await FileSystem.readAsStringAsync(fileUri);
    const report: AnalysisReport = JSON.parse(content);
    // Retornamos apenas um resumo para não carregar dados pesados na lista
    reports.push({
      id: report.id,
      setupData: report.setupData,
      savedAt: report.savedAt,
    });
  }
  // Ordena do mais recente para o mais antigo
  return reports.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
};

// Carrega um relatório completo pelo seu ID
export const loadAnalysisReport = async (id: string): Promise<AnalysisReport | null> => {
    await ensureDirExists();
    const fileUri = reportsDir + `report-${id}.json`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
        return null;
    }
    const content = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(content);
};