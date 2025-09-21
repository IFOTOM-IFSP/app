import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

import type { AnalysisReport } from '@/src/models/analysis';
import type { LegacySpectrometerProfile } from '@/src/models/spectrometerProfile';
import type { CalibrationCurve } from '@/types/api';
import type { Matrix } from '@/types/types';

const PROFILES_KEY = 'spectrometer_profiles';               // biblioteca de perfis (legado)
const CURVES_KEY = 'calibration_curves';                    // biblioteca de curvas
const BASELINE_IMG_KEY = 'session_baseline_images';         // baseline em imagens (legado/compat)
const BASELINE_VEC_KEY = 'session_baseline_vectors';        // baseline em vetores (novo)
const ACTIVE_DEVICE_PROFILE_KEY = '@ifotom/device_profile'; // perfil ativo único

const REPORTS_DIR = FileSystem.documentDirectory + 'analysis_reports/';
const INDEX_FILE = REPORTS_DIR + 'index.json';

async function ensureDirExists(dir: string) {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

async function readJSONFile<T>(uri: string): Promise<T | null> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) return null;
    const s = await FileSystem.readAsStringAsync(uri);
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

async function writeJSONFile(uri: string, data: unknown) {
  await ensureDirExists(REPORTS_DIR);
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(data, null, 2));
}

export const loadProfiles = async (): Promise<LegacySpectrometerProfile[]> => {
  try {
    const s = await AsyncStorage.getItem(PROFILES_KEY);
    return s ? JSON.parse(s) : [];
  } catch (e) {
    console.error('Failed to load profiles.', e);
    return [];
  }
};

export const saveProfiles = async (profiles: LegacySpectrometerProfile[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles.', e);
  }
};

export type DeviceProfileActive = {
  device_hash: string;
  pixel_to_wavelength: { a0: number; a1: number; a2?: number; rmse_nm?: number };
  roi: { x: number; y: number; width: number; height: number };
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string } | Record<string, string>;
};

export async function saveActiveDeviceProfile(p: DeviceProfileActive): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_DEVICE_PROFILE_KEY, JSON.stringify(p));
}

export async function loadActiveDeviceProfile(): Promise<DeviceProfileActive | null> {
  const s = await AsyncStorage.getItem(ACTIVE_DEVICE_PROFILE_KEY);
  return s ? (JSON.parse(s) as DeviceProfileActive) : null;
}

export async function clearActiveDeviceProfile(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_DEVICE_PROFILE_KEY);
}


function normalizeCurveRange(curve: any): CalibrationCurve {
  const range = curve.range
    ? {
        cmin: curve.range.cmin ?? curve.range.Cmin,
        cmax: curve.range.cmax ?? curve.range.Cmax,
      }
    : undefined;

  return {
    m: Number(curve.m),
    b: Number(curve.b),
    R2: curve.R2,
    SEE: curve.SEE,
    s_m: curve.s_m,
    s_b: curve.s_b,
    LOD: curve.LOD,
    LOQ: curve.LOQ,
    range,
  };
}

export const loadCurves = async (): Promise<CalibrationCurve[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CURVES_KEY);
    const raw = jsonValue ? JSON.parse(jsonValue) : [];
    return Array.isArray(raw) ? raw.map(normalizeCurveRange) : [];
  } catch (e) {
    console.error('Failed to load curves.', e);
    return [];
  }
};

export const saveCurves = async (curves: CalibrationCurve[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURVES_KEY, JSON.stringify(curves));
  } catch (e) {
    console.error('Failed to save curves.', e);
  }
};

export type ImageLike =
  | string                 // uri 'file://...' ou base64 'data:...'
  | { uri: string }        // padrão Image/Expo
  | { base64: string }
  | { path: string };

export type ImageBurst = ImageLike[];

export type BaselineImages = {
  darkSignalImages: ImageBurst;
  whiteSignalImages: ImageBurst;
  timestamp: number;
};

export const saveBaselineImages = async (data: BaselineImages): Promise<void> => {
  try {
    await AsyncStorage.setItem(BASELINE_IMG_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save baseline (images).', e);
  }
};

export const loadBaselineImages = async (): Promise<BaselineImages | null> => {
  try {
    const s = await AsyncStorage.getItem(BASELINE_IMG_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    console.error('Failed to load baseline (images).', e);
    return null;
  }
};

export const clearBaselineImages = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BASELINE_IMG_KEY);
  } catch (e) {
    console.error('Failed to clear baseline (images).', e);
  }
};

export type BaselineVectors = {
  darkBurst: Matrix;   // [frames x points]
  whiteBurst: Matrix;  // [frames x points]
  ts: number;          // timestamp
};

export const saveBaselineVectors = async (data: BaselineVectors): Promise<void> => {
  try {
    await AsyncStorage.setItem(BASELINE_VEC_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save baseline (vectors).', e);
  }
};

export const loadBaselineVectors = async (): Promise<BaselineVectors | null> => {
  try {
    const s = await AsyncStorage.getItem(BASELINE_VEC_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    console.error('Failed to load baseline (vectors).', e);
    return null;
  }
};

export const clearBaselineVectors = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BASELINE_VEC_KEY);
  } catch (e) {
    console.error('Failed to clear baseline (vectors).', e);
  }
};

type HistorySummary = Pick<AnalysisReport, 'id' | 'setupData' | 'savedAt'>;

type HistoryIndex = {
  version: 1;
  items: HistorySummary[]; // ordenados desc por savedAt
};

async function loadIndex(): Promise<HistoryIndex> {
  await ensureDirExists(REPORTS_DIR);
  const idx = await readJSONFile<HistoryIndex>(INDEX_FILE);
  if (!idx) return { version: 1, items: [] };
  return { version: 1, items: Array.isArray(idx.items) ? idx.items : [] };
}

async function saveIndex(index: HistoryIndex) {
  await writeJSONFile(INDEX_FILE, index);
}

export async function saveAnalysisReport(report: AnalysisReport): Promise<void> {
  await ensureDirExists(REPORTS_DIR);
  const fileUri = REPORTS_DIR + `report-${report.id}.json`;
  await writeJSONFile(fileUri, report);

  const idx = await loadIndex();
  const summary: HistorySummary = {
    id: report.id,
    setupData: report.setupData,
    savedAt: report.savedAt,
  };
  const others = idx.items.filter((i) => i.id !== report.id);
  const items = [summary, ...others].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
  await saveIndex({ version: 1, items });
}

export async function getHistoryList(): Promise<HistorySummary[]> {
  await ensureDirExists(REPORTS_DIR);
  const idx = await loadIndex();

  if (!idx.items.length) {
    const files = await FileSystem.readDirectoryAsync(REPORTS_DIR);
    const items: HistorySummary[] = [];
    for (const file of files) {
      if (!file.startsWith('report-') || !file.endsWith('.json')) continue;
      const report = await readJSONFile<AnalysisReport>(REPORTS_DIR + file);
      if (report) {
        items.push({
          id: report.id,
          setupData: report.setupData,
          savedAt: report.savedAt,
        });
      }
    }
    items.sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
    await saveIndex({ version: 1, items });
    return items;
  }

  return idx.items;
}

export async function loadAnalysisReport(id: string): Promise<AnalysisReport | null> {
  await ensureDirExists(REPORTS_DIR);
  const fileUri = REPORTS_DIR + `report-${id}.json`;
  return readJSONFile<AnalysisReport>(fileUri);
}

export async function deleteAnalysisReport(id: string): Promise<void> {
  await ensureDirExists(REPORTS_DIR);
  const fileUri = REPORTS_DIR + `report-${id}.json`;

  const info = await FileSystem.getInfoAsync(fileUri);
  if (info.exists) {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  }

  const idx = await loadIndex();
  const items = idx.items.filter((i) => i.id !== id);
  await saveIndex({ version: 1, items });
}

export async function pruneHistory(maxItems = 200): Promise<void> {
  await ensureDirExists(REPORTS_DIR);
  const idx = await loadIndex();
  if (idx.items.length <= maxItems) return;

  const toDelete = idx.items.slice(maxItems);
  for (const it of toDelete) {
    const uri = REPORTS_DIR + `report-${it.id}.json`;
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) await FileSystem.deleteAsync(uri, { idempotent: true });
  }
  const items = idx.items.slice(0, maxItems);
  await saveIndex({ version: 1, items });
}

export async function exportAllReports(): Promise<{ exportedAt: string; reports: AnalysisReport[] }> {
  await ensureDirExists(REPORTS_DIR);
  const files = await FileSystem.readDirectoryAsync(REPORTS_DIR);
  const reports: AnalysisReport[] = [];
  for (const file of files) {
    if (!file.startsWith('report-') || !file.endsWith('.json')) continue;
    const r = await readJSONFile<AnalysisReport>(REPORTS_DIR + file);
    if (r) reports.push(r);
  }
  reports.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  return { exportedAt: new Date().toISOString(), reports };
}
