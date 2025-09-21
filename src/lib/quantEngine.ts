
import { analyzeQuant } from '@/services/api';
import { computeAStatsFromBursts, quantAnalyzeLocal } from '@/src/lib/quantCore';
import type { CalibrationCurve, PixelToWavelength, QuantAnalyzeRequest, QuantAnalyzeResponse } from '@/types/api';
import type { Matrix } from '@/types/types';

export const TARGET_POINTS = 2048;

export type MinimalDeviceProfile = {
  device_hash: string;
  pixel_to_nm: { a0: number; a1: number; a2?: number };
  rmse_nm?: number;
  roi: { x: number; y: number; w: number; h: number };
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string };
};

export type MinimalParams = { lambda_nm: number; window_nm?: number } & { useLocalCore?: boolean };

export type MinimalAcquisition = {
  darkNoise?: Matrix;
  whiteNoise?: Matrix;
  ref1?: Matrix;
  sample?: Matrix;
  ref2?: Matrix;
  standards?: { C: number; darkNoise: Matrix; ref: Matrix; sample: Matrix }[];
};

export type MinimalCurve = { m: number; b: number; s_m?: number; s_b?: number; range?: { cmin: number; cmax: number } } | null;

export type QuantCtxLike = {
  params: MinimalParams;
  deviceProfile: MinimalDeviceProfile;
  acquisition: MinimalAcquisition;
  curve: MinimalCurve;
};

function scalePixelToWavelength(dp: MinimalDeviceProfile, newW: number): PixelToWavelength {
  const origW = dp.roi.w;
  const alpha = (origW > 1 && newW > 1) ? (origW - 1) / (newW - 1) : 1;
  return {
    a0: dp.pixel_to_nm.a0,
    a1: (dp.pixel_to_nm.a1 ?? 0) * alpha,
    a2: dp.pixel_to_nm.a2 != null ? dp.pixel_to_nm.a2 * alpha * alpha : undefined,
    rmse_nm: dp.rmse_nm,
  };
}

function meanVector(burst?: Matrix): number[] | undefined {
  if (!burst?.length) return undefined;
  const n = burst.length;
  const cols = burst[0]?.length ?? 0;
  const out = new Array(cols).fill(0);
  for (let i = 0; i < n; i++) {
    const row = burst[i] as number[];
    for (let c = 0; c < cols; c++) out[c] += row[c] ?? 0;
  }
  for (let c = 0; c < cols; c++) out[c] /= n;
  return out;
}

function lambdaArray(p2w: PixelToWavelength, cols: number): number[] {
  const arr = new Array(cols);
  for (let x = 0; x < cols; x++) arr[x] = p2w.a0 + p2w.a1 * x + (p2w.a2 ? p2w.a2 * x * x : 0);
  return arr;
}

function ensureAcq(acq: MinimalAcquisition) {
  if (!acq.darkNoise?.length)  throw new Error('darkNoise vazio');
  if (!acq.ref1?.length)       throw new Error('ref1 vazio');
  if (!acq.sample?.length)     throw new Error('sample vazio');
}

// ===== ONLINE =====
export async function quantifyApi(ctx: QuantCtxLike): Promise<QuantAnalyzeResponse> {
  const { params, deviceProfile: dp, acquisition: acq, curve } = ctx;
  ensureAcq(acq);

  const p2wScaled = scalePixelToWavelength(dp, TARGET_POINTS);

  const calibration: QuantAnalyzeRequest['calibration'] = curve
    ? { m: curve.m, b: curve.b }
    : { standards: (acq.standards ?? []).map((s) => {
        const { A_mean, A_sd } = computeAStatsFromBursts(
          s.darkNoise, s.ref, s.sample,
          { a0: p2wScaled.a0, a1: p2wScaled.a1, a2: p2wScaled.a2 },
          params.lambda_nm, params.window_nm
        );
        return { C: s.C, A_mean, A_sd };
      }) };

  const payload: QuantAnalyzeRequest = {
    lambda_nm: params.lambda_nm,
    window_nm: params.window_nm,
    device_profile: {
      device_hash: dp.device_hash,
      pixel_to_wavelength: p2wScaled,
      roi: { x: dp.roi.x, y: dp.roi.y, width: TARGET_POINTS, height: dp.roi.h },
      camera_meta: dp.camera_meta,
    },
    calibration,
    dark:   { frames: acq.darkNoise! },
    white_noise: acq.whiteNoise ? { frames: acq.whiteNoise } : undefined,
    ref:    { frames: acq.ref1! },
    sample: { frames: acq.sample! },
    pseudo_double_beam: acq.ref2 ? { ref_after: { frames: acq.ref2 } } : undefined,
  };

  return analyzeQuant(payload);
}

// ===== LOCAL =====
export async function quantifyLocal(ctx: QuantCtxLike): Promise<QuantAnalyzeResponse> {
  const { params, deviceProfile: dp, acquisition: acq, curve } = ctx;
  ensureAcq(acq);

  const p2wScaled = scalePixelToWavelength(dp, TARGET_POINTS);

  const calibInput = curve
    ? { type: 'coeffs' as const, curve }
    : { type: 'standards' as const, points: (acq.standards ?? []).map((s) => {
        const { A_mean, A_sd } = computeAStatsFromBursts(
          s.darkNoise, s.ref, s.sample,
          { a0: p2wScaled.a0, a1: p2wScaled.a1, a2: p2wScaled.a2 },
          params.lambda_nm, params.window_nm
        );
        return { C: s.C, A_mean, A_sd };
      }) };

  const local = quantAnalyzeLocal({
    lambda_nm: params.lambda_nm,
    window_nm: params.window_nm,
    pixel_to_wavelength: { a0: p2wScaled.a0, a1: p2wScaled.a1, a2: p2wScaled.a2 },
    dark:   acq.darkNoise!,
    ref:    acq.ref1!,
    sample: acq.sample!,
    ref_after: acq.ref2,
    calibration: calibInput,
  });

  const cols = acq.sample![0].length || TARGET_POINTS;
  const lambda = lambdaArray(p2wScaled, cols);
  const I_dark        = meanVector(acq.darkNoise);
  const I_ref         = meanVector(acq.ref1);
  const I_sample      = meanVector(acq.sample);
  const I_white_noise = meanVector(acq.whiteNoise);

  const localQA = local.QA ?? ({} as any);

  const resp: QuantAnalyzeResponse = {
    A_mean: local.A_mean,
    A_sd:   local.A_sd,
    CV:     local.CV,
    C:      local.C,
    CI95:   local.CI95,
    QA: {
      saturation: localQA.saturation ?? false,
      outliers:   localQA.outliers   ?? 0,
      in_range:   localQA.in_range   ?? true,
      drift:      localQA.drift      ?? false,
      notes:      localQA.notes,
    },
    spectrum: { lambda, I_dark, I_white_noise, I_ref, I_sample, window_nm: params.window_nm },
    calib: local.calib as CalibrationCurve | undefined,
  };
  return resp;
}

// ===== HÍBRIDO / roteamento =====
export type QuantStrategy = 'online' | 'local' | 'auto';

export async function quantifyHybrid(
  ctx: QuantCtxLike,
  strategy: QuantStrategy = 'auto'
): Promise<{ result: QuantAnalyzeResponse; source: 'api' | 'local' }> {
  if (strategy === 'local') {
    const result = await quantifyLocal(ctx);
    return { result, source: 'local' };
  }
  if (strategy === 'online') {
    const result = await quantifyApi(ctx);
    return { result, source: 'api' };
  }
  try {
    const result = await quantifyApi(ctx);
    return { result, source: 'api' };
  } catch (e) {
    console.warn('[quantEngine] API falhou, usando processamento local como fallback:', e);
    const result = await quantifyLocal(ctx);
    return { result, source: 'local' };
  }
}
