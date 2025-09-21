import { NativeModules } from "react-native";

import { loadDeviceProfile } from "@/services/deviceProfile";
import { AnalysisParams, Matrix, ROI } from "@/types/types";

const DEFAULT_VECTOR_LENGTH = 1024;
const SATURATION_THRESHOLD = 252;
const SATURATION_FRACTION = 0.98; // ~98% do range útil

type NativeSpectrometerModule = {
  captureBurst: (options: Record<string, unknown>) => Promise<unknown>;
} & Record<string, unknown>;

type NormalizedCapture = {
  width: number;
  height: number;
  frames: ArrayLike<number>[];
};

let cachedNativeModule: NativeSpectrometerModule | null | undefined;

function findNativeModule(): NativeSpectrometerModule | undefined {
  if (cachedNativeModule !== undefined) return cachedNativeModule ?? undefined;

  const candidates = [
    "SpectrometerCapture",
    "SpectrometerModule",
    "Spectrometer",
    "IfotomSpectrometer",
    "VisionSpectrometer",
    "SpectroCapture",
  ];

  const modules = NativeModules as Record<string, unknown>;
  for (const key of candidates) {
    const candidate = modules?.[key] as NativeSpectrometerModule | undefined;
    if (candidate && typeof candidate.captureBurst === "function") {
      cachedNativeModule = candidate;
      return candidate;
    }
  }
  cachedNativeModule = null;
  return undefined;
}

function parseNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

async function callOptionalByName(module: NativeSpectrometerModule, names: string[], ...args: unknown[]): Promise<boolean> {
  for (const name of names) {
    const fn = (module as any)?.[name];
    if (typeof fn === "function") {
      try {
        const result = fn(...args);
        if (result && typeof (result as any).then === "function") {
          await (result as Promise<unknown>);
        }
        return true;
      } catch (err) {
        console.warn(`[acquisition] ${name} falhou`, err);
      }
    }
  }
  return false;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toROI(value: any): ROI | undefined {
  if (!value || typeof value !== "object") return undefined;
  if ("w" in value && "h" in value) {
    return { x: (value.x ?? 0) as number, y: (value.y ?? 0) as number, w: (value.w ?? value.width ?? 0) as number, h: (value.h ?? value.height ?? 0) as number };
  }
  if ("width" in value && "height" in value) {
    return { x: (value.x ?? 0) as number, y: (value.y ?? 0) as number, w: (value.width ?? 0) as number, h: (value.height ?? 0) as number };
  }
  return undefined;
}

function base64ToUint8(data: string): Uint8Array {
  const globalAny = globalThis as Record<string, any>;
  if (typeof globalAny?.atob === "function") {
    const binary = globalAny.atob(data);
    const len = binary.length;
    const out = new Uint8Array(len);
    for (let i = 0; i < len; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  if (typeof globalAny?.Buffer === "function") {
    return Uint8Array.from(globalAny.Buffer.from(data, "base64"));
  }
  throw new Error("Base64 decoder not available");
}

function normalizeFrame(frame: any): ArrayLike<number> {
  if (!frame) throw new Error("Frame vazio");
  if (frame instanceof Uint8Array || frame instanceof Uint16Array || frame instanceof Float32Array) return frame;
  if (Array.isArray(frame) && frame.length && typeof frame[0] === "number") return frame as number[];
  if (Array.isArray(frame) && frame.length && typeof frame[0] !== "number") {
    throw new Error("Formato de frame não suportado");
  }
  if (typeof frame === "string") return base64ToUint8(frame);
  if (typeof frame === "object") {
    if ((frame as any).pixels) return normalizeFrame((frame as any).pixels);
    if ((frame as any).data) return normalizeFrame((frame as any).data);
    if ((frame as any).buffer) return normalizeFrame((frame as any).buffer);
  }
  throw new Error("Formato de frame não suportado");
}

function normalizeCaptureResult(raw: any, fallbackROI?: ROI): NormalizedCapture {
  if (!raw) throw new Error("Resposta de captura vazia");

  const container = Array.isArray(raw) ? {} : (raw ?? {});
  let frames: any[] | undefined;
  if (Array.isArray(raw)) {
    frames = raw;
  } else {
    frames = Array.isArray((container as any).frames)
      ? (container as any).frames
      : Array.isArray((container as any).data)
        ? (container as any).data
        : Array.isArray((container as any).images)
          ? (container as any).images
          : Array.isArray((container as any).burst)
            ? (container as any).burst
            : undefined;
  }

  if (!frames || !frames.length) throw new Error("Captura não retornou frames");

  const width =
    (container as any).width ??
    (container as any).frameWidth ??
    (container as any).cols ??
    (container as any).imageWidth ??
    (Array.isArray((container as any).dimensions) ? (container as any).dimensions[0] : undefined) ??
    fallbackROI?.w;

  const height =
    (container as any).height ??
    (container as any).frameHeight ??
    (container as any).rows ??
    (container as any).imageHeight ??
    (Array.isArray((container as any).dimensions) ? (container as any).dimensions[1] : undefined) ??
    fallbackROI?.h;

  if (!width || !height) throw new Error("Dimensões do frame ausentes na captura");

  return {
    width: Number(width),
    height: Number(height),
    frames: frames.map(normalizeFrame),
  };
}

function normalizeROI(roi: ROI | undefined, width: number, height: number): ROI {
  if (!roi) return { x: 0, y: 0, w: width, h: height };
  const x = clamp(Math.round(roi.x), 0, Math.max(0, width - 1));
  const y = clamp(Math.round(roi.y), 0, Math.max(0, height - 1));
  const w = clamp(Math.round(roi.w), 1, Math.max(1, width - x));
  const h = clamp(Math.round(roi.h), 1, Math.max(1, height - y));
  return { x, y, w, h };
}


type FrameLayout = {
  pixelStride: number;   // 1 (mono) ou 4 (RGBA)
  rowStride: number;     // width * pixelStride
  channels: number;      // 1 ou 4 (suporte básico)
  bitDepth: 8 | 16 | 32; // heurístico
  maxValue: number;      // 255, 65535 ou 1.0
};

function inferFrameLayout(frame: ArrayLike<number>, width: number, height: number): FrameLayout {
  const length = (frame as any).length ?? (width * height);
  if (length === width * height * 4) {
    return { pixelStride: 4, rowStride: width * 4, channels: 4, bitDepth: 8, maxValue: 255 };
  }
  if (frame instanceof Uint8Array)   return { pixelStride: 1, rowStride: width, channels: 1, bitDepth: 8,  maxValue: 255 };
  if (frame instanceof Uint16Array)  return { pixelStride: 1, rowStride: width, channels: 1, bitDepth: 16, maxValue: 65535 };
  if (frame instanceof Float32Array) return { pixelStride: 1, rowStride: width, channels: 1, bitDepth: 32, maxValue: 1.0 };
  return { pixelStride: 1, rowStride: width, channels: 1, bitDepth: 8, maxValue: 255 };
}

function pickLumaSample(frame: ArrayLike<number>, baseIndex: number, layout: FrameLayout): number {
  if (layout.channels === 1) return Number((frame as any)[baseIndex] ?? 0);
  return Number((frame as any)[baseIndex] ?? 0);
}

function computeFrameStatsInROI(
  frame: ArrayLike<number>,
  frameWidth: number,
  frameHeight: number,
  roi: ROI,
  layout: FrameLayout
) {
  const { x, y, w, h } = roi;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let sum = 0;
  let count = 0;

  const row0 = y * layout.rowStride + x * layout.pixelStride;
  for (let row = 0; row < h; row++) {
    const rowBase = row0 + row * layout.rowStride;
    for (let col = 0; col < w; col++) {
      const baseIndex = rowBase + col * layout.pixelStride;
      const v = pickLumaSample(frame, baseIndex, layout);
      if (v < min) min = v;
      if (v > max) max = v;
      sum += v;
      count++;
    }
  }
  const mean = count ? sum / count : 0;
  return { min, max, mean, count };
}

function stageExpectations(stage: string, guard?: { lowPct?: number; highPct?: number }): { lowPct?: number; highPct?: number } {
  const base = (() => {
    if (stage.includes("dark"))  return { highPct: 0.12 };
    if (stage.includes("white")) return { lowPct: 0.12, highPct: 0.90 };
    if (stage.includes("ref"))   return { lowPct: 0.12, highPct: 0.90 };
    return {};
  })();
  return {
    lowPct: guard?.lowPct ?? (base as any).lowPct,
    highPct: guard?.highPct ?? (base as any).highPct,
  };
}

function extractSpectrum(
  frame: ArrayLike<number>,
  frameWidth: number,
  frameHeight: number,
  roi: ROI
): { vector: number[]; saturated: boolean } {
  const layout = inferFrameLayout(frame, frameWidth, frameHeight);
  let threshold = layout.maxValue * SATURATION_FRACTION;
  if (layout.bitDepth === 8) threshold = Math.min(threshold, SATURATION_THRESHOLD);

  const { x, y, w, h } = roi;
  const vector = new Array(w).fill(0);
  let saturated = false;

  const row0 = y * layout.rowStride + x * layout.pixelStride;
  for (let row = 0; row < h; row++) {
    const rowBase = row0 + row * layout.rowStride;
    for (let col = 0; col < w; col++) {
      const baseIndex = rowBase + col * layout.pixelStride;
      const value = pickLumaSample(frame, baseIndex, layout);
      vector[col] += value;
      if (!saturated && value >= threshold) saturated = true;
    }
  }

  return { vector, saturated };
}

function simulateVectors(count: number, columns: number, stage: string): Matrix {
  const vectors: Matrix = new Array(Math.max(count, 0));
  const baseline = stage.includes("dark") ? 4 : stage.includes("white") ? 260 : 120;
  const amplitude = stage.includes("white") ? 28 : 12;
  const width = Math.max(columns, 1);
  const peakCenter = width / 2;
  const peakWidth = Math.max(width / 8, 12);

  for (let i = 0; i < vectors.length; i++) {
    const row = new Array(width);
    const jitter = (Math.random() - 0.5) * 2;
    for (let x = 0; x < width; x++) {
      const gaussian = Math.exp(-((x - peakCenter) ** 2) / (2 * peakWidth * peakWidth));
      const noise = (Math.random() - 0.5) * amplitude * 0.35;
      row[x] = Math.max(0, baseline + amplitude * gaussian + noise + jitter);
    }
    vectors[i] = row;
  }
  return vectors;
}

async function applyCameraLocks(module: NativeSpectrometerModule, cameraMeta?: Record<string, string>) {
  await callOptionalByName(module, ["lockControls", "lockAutoControls"]);
  await callOptionalByName(module, ["lockAutoExposure", "lockAE"]);
  await callOptionalByName(module, ["lockAutoIso", "lockAutoISO"]);
  await callOptionalByName(module, ["lockAutoWhiteBalance", "lockAWB"]);

  const iso = parseNumber((cameraMeta as any)?.iso ?? (cameraMeta as any)?.ISO ?? (cameraMeta as any)?.Iso);
  if (iso != null) await callOptionalByName(module, ["setISO", "setManualISO"], iso);

  const exposureMs = parseNumber((cameraMeta as any)?.shutter_ms ?? (cameraMeta as any)?.exposure_ms ?? (cameraMeta as any)?.shutter);
  if (exposureMs != null) {
    const applied = await callOptionalByName(module, ["setShutterMs", "setExposureMs"], exposureMs);
    if (!applied) await callOptionalByName(module, ["setExposureTime", "setExposureUs"], exposureMs * 1000);
  }

  const whiteBalance = (cameraMeta as any)?.wb ?? (cameraMeta as any)?.white_balance ?? (cameraMeta as any)?.WB;
  if (whiteBalance) await callOptionalByName(module, ["setWhiteBalance", "setManualWhiteBalance"], whiteBalance);
}

async function releaseCameraLocks(module: NativeSpectrometerModule) {
  await callOptionalByName(module, ["unlockControls", "unlockAutoControls"]);
  await callOptionalByName(module, ["unlock", "release"]);
}

export async function acquireStageVectors(params: AnalysisParams, stage: string): Promise<Matrix> {
  const framesToCapture = Math.max(1, Math.floor(params.frames_per_burst ?? 10));

  const deviceProfile = await loadDeviceProfile().catch(() => null);
  const roiCandidate = toROI((deviceProfile as any)?.roi);
  const native = findNativeModule();

  if (!native) {
    console.warn(`[acquisition] Módulo nativo não encontrado. Usando simulação para ${stage}.`);
    return simulateVectors(framesToCapture, roiCandidate?.w ?? DEFAULT_VECTOR_LENGTH, stage);
  }

  const captureOptions: Record<string, unknown> = { stage, frames: framesToCapture };
  if (roiCandidate) captureOptions.roi = { x: roiCandidate.x, y: roiCandidate.y, width: roiCandidate.w, height: roiCandidate.h };
  if ((deviceProfile as any)?.camera_meta) captureOptions.cameraMeta = (deviceProfile as any).camera_meta;

  await applyCameraLocks(native, (deviceProfile as any)?.camera_meta);

  let capture: NormalizedCapture;
  try {
    const raw = await native.captureBurst(captureOptions);
    capture = normalizeCaptureResult(raw, roiCandidate);
  } finally {
    await releaseCameraLocks(native);
  }

  if (!capture.frames.length) throw new Error("Nenhum frame capturado");

  const roi = normalizeROI(roiCandidate, capture.width, capture.height);

  const layout = inferFrameLayout(capture.frames[0], capture.width, capture.height);
  const satThreshold = Math.min(layout.maxValue * SATURATION_FRACTION, SATURATION_THRESHOLD);

  const { lowPct, highPct } = stageExpectations(stage, (params as any).saturation_guard ?? undefined);

  const limit = Math.min(capture.frames.length, framesToCapture);
  const matrix: Matrix = new Array(limit);
  const saturatedIdx: number[] = [];
  const outOfRangeIdx: number[] = [];

  for (let i = 0; i < limit; i++) {
    const frame = capture.frames[i];

    const stats = computeFrameStatsInROI(frame, capture.width, capture.height, roi, layout);
    const meanPct = stats.mean / layout.maxValue;
    if ((lowPct != null && meanPct < lowPct) || (highPct != null && meanPct > highPct)) {
      outOfRangeIdx.push(i);
    }

    const { x, y, w, h } = roi;
    const vector = new Array(w).fill(0);
    let saturated = false;
    const row0 = y * layout.rowStride + x * layout.pixelStride;
    for (let row = 0; row < h; row++) {
      const rowBase = row0 + row * layout.rowStride;
      for (let col = 0; col < w; col++) {
        const baseIndex = rowBase + col * layout.pixelStride;
        const v = pickLumaSample(frame, baseIndex, layout);
        vector[col] += v;
        if (!saturated && v >= satThreshold) saturated = true;
      }
    }

    matrix[i] = vector;
    if (saturated) saturatedIdx.push(i);
  }

  if (saturatedIdx.length) throw new Error(`Saturação detectada nos frames: ${saturatedIdx.join(", ")}`);
  if (outOfRangeIdx.length) {
    console.warn(`[acquisition] ${stage}: média fora da faixa ${(lowPct ?? '-')}–${(highPct ?? '-')}`
      + ` nos frames: ${outOfRangeIdx.join(", ")} (bitDepth=${layout.bitDepth})`);
  }

  return matrix;
}

export async function acquireStandards(params: AnalysisParams): Promise<{ C: number; darkNoise: Matrix; whiteNoise: Matrix; ref: Matrix; sample: Matrix }[]> {
  if (!params.standards || !params.standards.length) return [];
  const out: { C: number; darkNoise: Matrix; whiteNoise: Matrix; ref: Matrix; sample: Matrix }[] = [];
  for (const s of params.standards) {
    const darkNoise = await acquireStageVectors(params, `std_${s.C}_darkNoise`);
    const whiteNoise = await acquireStageVectors(params, `std_${s.C}_whiteNoise`);
    const ref = await acquireStageVectors(params, `std_${s.C}_ref`);
    const sample = await acquireStageVectors(params, `std_${s.C}_sample`);
    out.push({ C: s.C, darkNoise, whiteNoise, ref, sample });
  }
  return out;
}

export function resampleVectorLinear(src: number[], targetLength: number): number[] {
  const n = src.length;
  const m = Math.max(2, Math.floor(targetLength));
  if (m === n) return src.slice();
  const out = new Array(m);
  const denom = (m - 1);
  const srcMaxIdx = n - 1;
  for (let i = 0; i < m; i++) {
    const pos = (i * srcMaxIdx) / denom;
    const i0 = Math.floor(pos);
    const i1 = Math.min(srcMaxIdx, i0 + 1);
    const t = pos - i0;
    out[i] = src[i0] * (1 - t) + src[i1] * t;
  }
  return out;
}

export function resampleBurstLinear(burst: Matrix, targetLength: number): Matrix {
  return burst.map(v => resampleVectorLinear(v as number[], targetLength));
}
