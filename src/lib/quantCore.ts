import type { Matrix, PixelToNm as PixelToWavelength } from '@/types/types';

export type CalibrationCurve = {
  m: number; b: number;
  R2?: number; SEE?: number; s_m?: number; s_b?: number;
  LOD?: number; LOQ?: number;                 // ← incluído
  range?: { cmin: number; cmax: number };
};

export type StandardsPoint = { C: number; A_mean: number; A_sd?: number };

export type CalibrationInput =
  | { type: 'coeffs'; curve: { m: number; b: number; s_m?: number; s_b?: number; range?: { cmin: number; cmax: number } } }
  | { type: 'standards'; points: StandardsPoint[] };

export type QAFlags = {
  saturation?: boolean; // normalmente já tratado na aquisição
  outliers: number;     // removidos na etapa de amostra
  in_range: boolean;
  drift: boolean;
  notes?: string[];
};

export type LocalQuantResult = {
  A_mean: number; A_sd: number; CV: number;
  C: number;
  CI95?: { low: number; high: number };
  QA: QAFlags;
  calib?: CalibrationCurve; // se curva foi construída aqui
};

export type QuantCoreInput = {
  lambda_nm: number;
  window_nm?: number; // padrão 4 nm (±2)
  pixel_to_wavelength: PixelToWavelength;

  dark: Matrix;           // [frames x points]
  ref: Matrix;            // [frames x points] (antes)
  sample: Matrix;         // [frames x points]
  ref_after?: Matrix;     // [frames x points] (opcional)

  calibration?: CalibrationInput; // coeficientes ou padrões
};

const EPS = 1e-12;
const MAD_SCALE = 1.4826; // para aproximar sd

function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 ? sorted[mid] : 0.5 * (sorted[mid - 1] + sorted[mid]);
}

function robustAggregate(values: number[], maxRejectFraction = 0.2) {
  // mediana/MAD → remove outliers |x - med|/(MAD*1.4826) > 3.5
  const n = values.length;
  if (n === 0) return { mean: NaN, sd: NaN, kept: 0, removed: 0, used: [] as number[] };
  const sorted = [...values].sort((a, b) => a - b);
  const med = median(sorted);
  const absDev = values.map(v => Math.abs(v - med));
  const mad = median(absDev);
  const sigma = (mad || EPS) * MAD_SCALE;
  const keptVals = values.filter(v => Math.abs(v - med) / (sigma || EPS) <= 3.5);
  const removed = n - keptVals.length;
  // se removeu demais, volta pra média simples
  const used = removed / n > maxRejectFraction ? values : keptVals;
  const m = used.reduce((a, b) => a + b, 0) / (used.length || 1);
  const sd = Math.sqrt(used.reduce((a, b) => a + (b - m) * (b - m), 0) / Math.max(1, used.length - 1));
  return { mean: m, sd, kept: used.length, removed, used };
}

function buildWindowIdx(nPoints: number, p2w: PixelToWavelength, lambda_nm: number, window_nm: number) {
  const half = (window_nm || 4) / 2; // default 4 nm
  const idx: number[] = [];
  for (let x = 0; x < nPoints; x++) {
    const lam = p2w.a0 + p2w.a1 * x + (p2w.a2 ? p2w.a2 * x * x : 0);
    if (Math.abs(lam - lambda_nm) <= half) idx.push(x);
  }
  // fallback mínimo
  if (idx.length === 0) {
    let best = 0, bestErr = Infinity;
    for (let x = 0; x < nPoints; x++) {
      const lam = p2w.a0 + p2w.a1 * x + (p2w.a2 ? p2w.a2 * x * x : 0);
      const err = Math.abs(lam - lambda_nm);
      if (err < bestErr) { bestErr = err; best = x; }
    }
    idx.push(best);
  }
  return idx;
}

function meanInWindow(vec: number[], idx: number[]): number {
  let s = 0; for (const k of idx) s += vec[k] ?? 0; return s / (idx.length || 1);
}

function burstMeans(burst: Matrix, idx: number[]): number[] {
  const out: number[] = new Array(burst.length);
  for (let i = 0; i < burst.length; i++) out[i] = meanInWindow(burst[i] as number[], idx);
  return out;
}

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }

function linearRegression(points: StandardsPoint[]): CalibrationCurve {
  const xs = points.map(p => p.C);
  const ys = points.map(p => p.A_mean);
  const n = xs.length;
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  let Sxx = 0, Sxy = 0, Syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - xbar, dy = ys[i] - ybar;
    Sxx += dx * dx; Sxy += dx * dy; Syy += dy * dy;
  }
  const m = Sxy / (Sxx || EPS);
  const b = ybar - m * xbar;
  // SEE e R2
  let SSE = 0; for (let i = 0; i < n; i++) { const e = ys[i] - (m * xs[i] + b); SSE += e * e; }
  const SEE = Math.sqrt(SSE / Math.max(1, n - 2));
  const R2 = 1 - SSE / (Syy || EPS);
  const s_m = Math.sqrt((SEE * SEE) / Math.max(EPS, Sxx));
  const s_b = Math.sqrt((SEE * SEE) * (1 / n + (xbar * xbar) / Math.max(EPS, Sxx)));
  const range = { cmin: Math.min(...xs), cmax: Math.max(...xs) };
  return { m, b, R2, SEE, s_m, s_b, range };
}

function ci95_concentration(A_mean: number, s_A: number, curve: CalibrationCurve) {
  // Inversão A = m C + b → C = (A - b)/m
  const C = (A_mean - curve.b) / (curve.m || EPS);
  // Aproximação por propagação de incerteza, ignorando covariâncias
  const varA = s_A * s_A;
  const varm = (curve.s_m ?? 0) * (curve.s_m ?? 0);
  const varb = (curve.s_b ?? 0) * (curve.s_b ?? 0);
  const dCdA = 1 / (curve.m || EPS);
  const dCdM = -(A_mean - curve.b) / ((curve.m || EPS) * (curve.m || EPS));
  const dCdB = -1 / (curve.m || EPS);
  const varC = dCdA * dCdA * varA + dCdM * dCdM * varm + dCdB * dCdB * varb;
  const s_C = Math.sqrt(Math.max(0, varC));
  const half = 1.96 * s_C;
  return { C, CI95: { low: C - half, high: C + half } };
}

function sigmaBlankFromRef(dark: Matrix, ref: Matrix, idx: number[]): number {
  // A_blank_i = -log10( (I_ref_i - I_dark_med) / (I_ref_med - I_dark_med) )
  const darkMeans = burstMeans(dark, idx);
  const refMeans  = burstMeans(ref, idx);
  const I_dark_med = robustAggregate(darkMeans).mean;
  const I_ref_med  = robustAggregate(refMeans).mean;
  const Ablank: number[] = [];
  for (let i = 0; i < refMeans.length; i++) {
    const Irp = (refMeans[i] - I_dark_med);
    const Ir_med_p = (I_ref_med - I_dark_med);
    if (!(Irp > 0) || !(Ir_med_p > 0)) continue;
    const T = Irp / Ir_med_p;
    if (!(T > 0 && T <= 1)) continue;
    Ablank.push(-Math.log10(T));
  }
  return robustAggregate(Ablank).sd; // σ_blank em A
}

export function quantAnalyzeLocal(input: QuantCoreInput): LocalQuantResult {
  const { lambda_nm, window_nm = 4, pixel_to_wavelength, dark, ref, sample, ref_after, calibration } = input;

  const nPoints = sample[0]?.length ?? ref[0]?.length ?? dark[0]?.length ?? 0;
  if (!nPoints) throw new Error('vectors missing');

  // 1) Janela em torno de λ
  const idx = buildWindowIdx(nPoints, pixel_to_wavelength, lambda_nm, window_nm);

  // 2) Médias por frame nas janelas
  const darkMeans = burstMeans(dark, idx);
  const refMeans  = burstMeans(ref, idx);
  const sampleMeans = burstMeans(sample, idx);
  const refAfterMeans = ref_after ? burstMeans(ref_after, idx) : undefined;

  // 3) Agregar dark/ref por robustez (escalares)
  const darkAgg = robustAggregate(darkMeans);
  const refAgg  = robustAggregate(refMeans);
  const refAfterAgg = refAfterMeans ? robustAggregate(refAfterMeans) : undefined;
  const I_dark = darkAgg.mean;
  const I_ref_before = refAgg.mean;
  const I_ref_after  = refAfterAgg?.mean ?? I_ref_before;

  // 4) Absorbância por frame (com pseudo double-beam por interpolação linear)
  const N = sampleMeans.length;
  const Aframes: number[] = [];
  let invalidT = 0;
  for (let i = 0; i < N; i++) {
    const w = N > 1 ? i / (N - 1) : 0.5;
    const I_ref_interp = lerp(I_ref_before, I_ref_after, w);
    const I_ref_p = I_ref_interp - I_dark;
    const I_s_p   = sampleMeans[i] - I_dark;
    if (!(I_ref_p > 0) || !(I_s_p > 0)) { invalidT++; continue; }
    const T = I_s_p / I_ref_p;
    if (!(T > 0 && T <= 1)) { invalidT++; continue; }
    const A = -Math.log10(T);
    Aframes.push(A);
  }

  // 5) Agregação robusta das replicatas (amostra)
  const agg = robustAggregate(Aframes);
  const A_mean = agg.mean;
  const A_sd   = agg.sd;
  const CV = Math.abs(A_mean) > EPS ? (A_sd / Math.abs(A_mean)) * 100 : NaN;

  // 6) Curva e concentração
  let curve: CalibrationCurve | undefined;
  if (calibration?.type === 'standards') {
    const pts = calibration.points?.filter(p => Number.isFinite(p.C) && Number.isFinite(p.A_mean)) ?? [];
    if (pts.length >= 2) {
      curve = linearRegression(pts);
      // LOD/LOQ via ref/dark atuais
      const sigmaBlank = sigmaBlankFromRef(dark, ref, idx);
      if (Number.isFinite(sigmaBlank) && Math.abs(curve.m) > EPS) {
        curve.LOD = 3.3 * sigmaBlank / Math.abs(curve.m);
        curve.LOQ = 10  * sigmaBlank / Math.abs(curve.m);
      }
    }
  } else if (calibration?.type === 'coeffs') {
    curve = { m: calibration.curve.m, b: calibration.curve.b, s_m: calibration.curve.s_m, s_b: calibration.curve.s_b, range: calibration.curve.range };
  }
  if (!curve) throw new Error('calibration missing (m,b or standards)');

  const { C, CI95 } = ci95_concentration(A_mean, A_sd, curve);

  // 7) QA flags
  const notes: string[] = [];
  if (invalidT) notes.push(`Frames inválidos (T<=0 ou T>1): ${invalidT}`);
  if (agg.removed) notes.push(`Outliers removidos: ${agg.removed}`);

  const driftPct = Math.abs(I_ref_after - I_ref_before) / Math.max(EPS, I_ref_before);
  const drift = driftPct > 0.05; // 5% de mudança
  if (drift) notes.push(`Deriva detectada: ${(driftPct*100).toFixed(1)}%`);

  // Faixa linear (Beer–Lambert) — recomendação prática
  if (A_mean < 0.05 || A_mean > 1.5) {
    notes.push('Absorbância fora da faixa linear (~0.05 a 1.5). Considere diluir ou ajustar a exposição.');
  }

  // Sinal fraco no branco (I_ref′ baixo)
  const refLevel = I_ref_before - I_dark;
  const refDyn = refLevel / Math.max(EPS, I_ref_before);
  if (refDyn < 0.12) {
    notes.push('Sinal fraco no branco (I_ref′ baixo); aumente exposição/ISO ou melhore iluminação.');
  }

  const in_range = curve.range ? (C >= curve.range.cmin && C <= curve.range.cmax) : true;
  if (!in_range) notes.push('Concentração fora da faixa da curva');

  const QA: QAFlags = {
    saturation: false, // saturação deve ter sido tratada na aquisição
    outliers: agg.removed,
    in_range,
    drift,
    notes: notes.length ? notes : undefined,
  };

  const result: LocalQuantResult = {
    A_mean, A_sd, CV, C, CI95, QA,
    calib: calibration?.type === 'standards' ? curve : undefined
  };
  return result;
}

export function computeAStatsFromBursts(
  dark: Matrix, ref: Matrix, sample: Matrix, p2w: PixelToWavelength, lambda_nm: number, window_nm?: number
) {
  const nPoints = sample[0]?.length ?? ref[0]?.length ?? dark[0]?.length ?? 0;
  const idx = buildWindowIdx(nPoints, p2w, lambda_nm, window_nm ?? 4);
  const darkMeans = burstMeans(dark, idx);
  const refMeans  = burstMeans(ref, idx);
  const sampleMeans = burstMeans(sample, idx);
  const I_dark = robustAggregate(darkMeans).mean;
  const I_ref  = robustAggregate(refMeans).mean;
  const frames: number[] = [];
  for (let i = 0; i < sampleMeans.length; i++) {
    const I_rp = I_ref - I_dark; const I_sp = sampleMeans[i] - I_dark;
    if (!(I_rp > 0) || !(I_sp > 0)) continue;
    const T = I_sp / I_rp; if (!(T > 0 && T <= 1)) continue;
    frames.push(-Math.log10(T));
  }
  const agg = robustAggregate(frames);
  return { A_mean: agg.mean, A_sd: agg.sd };
}
