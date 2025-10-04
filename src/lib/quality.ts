import type { DeviceProfile, ROI } from '@/types/types';

export const LINEAR_A_MIN = 0.05;
export const LINEAR_A_MAX = 1.5;          // use 2.0 se sua ótica suportar
export const MIN_STANDARDS = 5;
export const MIN_R2 = 0.995;              // configurável
export const DRIFT_THRESHOLD = 0.05;      // 5%
export const REF_DYN_MIN = 0.12;          // 12% do nível do ref
export const RMSE_NM_MAX = 2.0;           // nm

export type StandardsPoint = { C: number; A_mean: number; A_sd?: number };
export type CalibrationCurve = {
  m: number; b: number; R2?: number; SEE?: number; s_m?: number; s_b?: number;
  LOD?: number; LOQ?: number; range?: { cmin: number; cmax: number };
};

export type Acceptance = { ok: boolean; issues: string[]; suggestions?: string[] };

export type AcceptanceConfig = {
  minPoints?: number;    // default: MIN_STANDARDS
  minR2?: number;        // default: MIN_R2
  linearAmin?: number;   // default: LINEAR_A_MIN
  linearAmax?: number;   // default: LINEAR_A_MAX
  useWLS?: boolean;      // default: true quando heteroscedástico
};

export function validatePreflight(profile: DeviceProfile | null, roi?: ROI): Acceptance {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!profile) {
    issues.push('Perfil do dispositivo ausente. Faça a calibração de λ (lasers).');
    return { ok: false, issues };
  }

  const r = roi ?? (profile.roi as ROI);
  if (!r || r.w <= 0 || r.h <= 0) {
    issues.push('ROI inválida (w/h ≤ 0). Refaça a calibração da ordem/fenda.');
  }

  const rmse = (profile as any).rmse_nm as number | undefined;
  if (typeof rmse === 'number') {
    if (rmse > RMSE_NM_MAX) {
      issues.push(`RMSE_λ alto (${rmse.toFixed(2)} nm > ${RMSE_NM_MAX} nm). Recalibre lasers.`);
    }
  } else {
    suggestions.push('RMSE_λ desconhecido. Recomenda-se caracterizar com ao menos 2–3 lasers.');
  }

  if (!profile.camera_meta) {
    suggestions.push('Camera meta ausente (ISO/exposição/WB). Travar AE/AWB e definir exposição fixa.');
  }

  return { ok: issues.length === 0, issues, suggestions: suggestions.length ? suggestions : undefined };
}

function olsRegression(points: StandardsPoint[]): CalibrationCurve {
  const xs = points.map(p => p.C);
  const ys = points.map(p => p.A_mean);
  const n = xs.length;

  if (n < 2) {
    return { m: NaN, b: NaN, R2: NaN, SEE: NaN, s_m: NaN, s_b: NaN, range: n ? { cmin: xs[0], cmax: xs[0] } : undefined };
  }

  const xbar = xs.reduce((a,b)=>a+b,0)/n;
  const ybar = ys.reduce((a,b)=>a+b,0)/n;
  let Sxx=0, Sxy=0, Syy=0; for (let i=0;i<n;i++){ const dx=xs[i]-xbar, dy=ys[i]-ybar; Sxx+=dx*dx; Sxy+=dx*dy; Syy+=dy*dy; }
  const m = Sxy/(Sxx||Number.EPSILON);
  const b = ybar - m*xbar;

  let SSE=0; for (let i=0;i<n;i++){ const e=ys[i]-(m*xs[i]+b); SSE+=e*e; }
  const SEE = Math.sqrt(SSE/Math.max(1,n-2));
  const R2 = 1 - SSE/(Syy||Number.EPSILON);
  const s_m = Math.sqrt((SEE*SEE)/Math.max(Number.EPSILON,Sxx));
  const s_b = Math.sqrt((SEE*SEE)*(1/n + (xbar*xbar)/Math.max(Number.EPSILON,Sxx)));
  const range = { cmin: Math.min(...xs), cmax: Math.max(...xs) };
  return { m,b,R2,SEE,s_m,s_b,range };
}

function wlsRegression(points: StandardsPoint[]): CalibrationCurve {
  // pesos = 1/var(A) se A_sd presente; caso contrário, cai em OLS
  const haveSD = points.some(p => typeof p.A_sd === 'number' && (p.A_sd ?? 0) > 0);
  if (!haveSD) return olsRegression(points);

  const xs = points.map(p => p.C);
  const ys = points.map(p => p.A_mean);
  const ws = points.map(p => 1/Math.max((p.A_sd ?? 0)**2, 1e-12));
  const n = xs.length;

  if (n < 2) return olsRegression(points);

  const W = ws.reduce((a,b)=>a+b,0);
  const xw = xs.reduce((a,x,i)=>a+ws[i]*x,0)/W;
  const yw = ys.reduce((a,y,i)=>a+ws[i]*y,0)/W;

  let Sxx=0, Sxy=0, Syy=0; for (let i=0;i<n;i++){ const dx=xs[i]-xw, dy=ys[i]-yw; Sxx+=ws[i]*dx*dx; Sxy+=ws[i]*dx*dy; Syy+=ws[i]*dy*dy; }
  const m = Sxy/(Sxx||Number.EPSILON);
  const b = yw - m*xw;

  let SSEw=0; for (let i=0;i<n;i++){ const e=ys[i]-(m*xs[i]+b); SSEw+=ws[i]*e*e; }
  const SSTw = Syy; // definição ponderada
  const SEE = Math.sqrt(SSEw/Math.max(1,n-2));
  const R2 = 1 - SSEw/(SSTw||Number.EPSILON);
  const s_m = Math.sqrt((SEE*SEE)/Math.max(Number.EPSILON,Sxx));
  const s_b = Math.sqrt((SEE*SEE)*(1/W + (xw*xw)/Math.max(Number.EPSILON,Sxx)));
  const range = { cmin: Math.min(...xs), cmax: Math.max(...xs) };
  return { m,b,R2,SEE,s_m,s_b,range };
}

function detectHeteroscedastic(points: StandardsPoint[], curve: CalibrationCurve): boolean {
  // heurística: variância de resíduos cresce com C OU A_sd cresce com C
  const xs = points.map(p=>p.C);
  const ys = points.map(p=>p.A_mean);
  const n = xs.length;
  if (n < 3) return false;

  const residuals = ys.map((y,i)=> y - (curve.m*xs[i]+curve.b));
  const mean = (arr:number[])=>arr.reduce((a,b)=>a+b,0)/Math.max(1,arr.length);
  const mx = mean(xs), mr = mean(residuals);
  const sx = Math.sqrt(mean(xs.map(x=> (x-mx)**2)) || 1e-12);
  const sr = Math.sqrt(mean(residuals.map(e=> (e-mr)**2)) || 1e-12);
  const cov = mean(xs.map((x,i)=> (x-mx)*(residuals[i]-mr)));
  const corr = cov / (sx*sr || 1e-12);

  const sdTrend = (()=>{
    const withSD = points.filter(p=> typeof p.A_sd === 'number');
    if (withSD.length < 3) return false;
    const c = withSD.map(p=>p.C); const s = withSD.map(p=>p.A_sd!);
    const mc = mean(c), ms = mean(s);
    let Scc=0, Scs=0; for (let i=0;i<c.length;i++){ const dc=c[i]-mc, ds=s[i]-ms; Scc+=dc*dc; Scs+=dc*ds; }
    const slope = Scs/(Scc||1e-12);
    return slope > 0; // SD aumenta com C
  })();

  return corr > 0.3 || sdTrend; // limiar heurístico
}

export function validateCalibrationAcceptance(
  points: StandardsPoint[],
  opts?: AcceptanceConfig
): { ok: boolean; issues: string[]; curve: CalibrationCurve; weights_used?: string } {
  const issues: string[] = [];
  const minPts = opts?.minPoints ?? MIN_STANDARDS;
  const minR2  = opts?.minR2 ?? MIN_R2;
  const A_MIN  = opts?.linearAmin ?? LINEAR_A_MIN;
  const A_MAX  = opts?.linearAmax ?? LINEAR_A_MAX;

  if (!points || points.length < minPts) {
    issues.push(`Curva com poucos pontos (n=${points?.length ?? 0} < ${minPts}).`);
  }

  const badA = points.filter(p => p.A_mean < A_MIN || p.A_mean > A_MAX).map(p=>p.C);
  if (badA.length) issues.push(`Padrões com A fora de ${A_MIN}–${A_MAX}: C={${badA.join(',')}}.`);

  let curve = olsRegression(points);
  let weights_used: string | undefined;

  // heteroscedasticidade => WLS se habilitado
  if ((opts?.useWLS ?? true) && detectHeteroscedastic(points, curve)) {
    curve = wlsRegression(points);
    weights_used = '1/sigma(A)^2';
  }

  if (Number.isFinite(curve.R2 as number) && (curve.R2 as number) < minR2) {
    issues.push(`R² baixo (${(curve.R2 as number).toFixed(4)} < ${minR2}).`);
  }

  return { ok: issues.length === 0, issues, curve, weights_used };
}

export function attachLODLOQ(curve: CalibrationCurve, sigmaBlankA?: number): CalibrationCurve {
  if (!sigmaBlankA || !Number.isFinite(sigmaBlankA) || !Number.isFinite(curve.m)) return curve;
  const mabs = Math.abs(curve.m || Number.EPSILON);
  const LOD = 3.3 * sigmaBlankA / mabs;
  const LOQ = 10  * sigmaBlankA / mabs;
  return { ...curve, LOD, LOQ };
}

export function buildActionMessages(params: {
  A_mean?: number;
  driftPct?: number;              // |ref_after - ref_before| / ref_before
  refDyn?: number;                // intensidade ref normalizada (0–1)
  qa?: { in_range?: boolean; saturation?: boolean; outliers?: number };
}): string[] {
  const msgs: string[] = [];
  const A = params.A_mean;
  if (typeof A === 'number' && A > (LINEAR_A_MAX)) {
    msgs.push('Dilua a amostra (×2) — A acima da faixa linear.');
  }
  if (typeof params.refDyn === 'number' && params.refDyn < REF_DYN_MIN) {
    const pct = Math.round(((REF_DYN_MIN / Math.max(1e-6, params.refDyn)) - 1) * 100);
    msgs.push(`Aumente a exposição em ~+${pct}% (ou melhore a iluminação).`);
  }
  if (typeof params.driftPct === 'number' && params.driftPct > DRIFT_THRESHOLD) {
    msgs.push('Refaça o branco — deriva acima do limite.');
  }
  if (params.qa?.saturation) {
    msgs.push('Reduza a exposição — saturação detectada.');
  }
  if (typeof params.qa?.outliers === 'number' && params.qa.outliers > 0) {
    msgs.push('Repositione a cuveta e repita — outliers removidos.');
  }
  if (params.qa?.in_range === false) {
    msgs.push('Amostra fora da faixa da curva — dilua e repita.');
  }
  return msgs;
}
