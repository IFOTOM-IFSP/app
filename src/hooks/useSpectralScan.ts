import { loadDeviceProfile } from '@/services/deviceProfile';
import { acquireStageVectors, resampleBurstLinear } from '@/src/lib/acquisition';
import { TARGET_POINTS } from '@/src/lib/quantEngine';
import type { AnalysisParams, Matrix } from '@/types/types';

type Spectrum = {
  lambda: number[];
  I_dark: number[];
  I_ref: number[];
  I_sample: number[];
  A: number[]; // -log10((Is-Id)/(Ir-Id)) em todo o espectro (com clamp básico)
};

function meanVector(burst: Matrix): number[] {
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

export async function runSpectralScan(params: Pick<AnalysisParams,
  'frames_per_burst'
>) : Promise<Spectrum> {
  const profile = await loadDeviceProfile();
  if (!profile) throw new Error('Perfil do dispositivo ausente');

  // captura única (dark/ref/sample)
  const dark   = await acquireStageVectors({ ...params, name: 'Spectral', build_curve: false, useLocalCore: true, standards: [] } as any, 'darkNoise');
  const ref1   = await acquireStageVectors({ ...params, name: 'Spectral', build_curve: false, useLocalCore: true, standards: [] } as any, 'ref1');
  const sample = await acquireStageVectors({ ...params, name: 'Spectral', build_curve: false, useLocalCore: true, standards: [] } as any, 'sample');

  // reamostra para 2048
  const dR = resampleBurstLinear(dark,   TARGET_POINTS);
  const rR = resampleBurstLinear(ref1,   TARGET_POINTS);
  const sR = resampleBurstLinear(sample, TARGET_POINTS);

  // médias
  const I_dark   = meanVector(dR);
  const I_ref    = meanVector(rR);
  const I_sample = meanVector(sR);

  // map λ
  const origW = profile.roi.w;
  const alpha = (origW > 1 && TARGET_POINTS > 1) ? (origW - 1)/(TARGET_POINTS - 1) : 1;
  const a0 = profile.pixel_to_nm.a0;
  const a1 = (profile.pixel_to_nm.a1 ?? 0) * alpha;
  const a2 = profile.pixel_to_nm.a2 != null ? profile.pixel_to_nm.a2 * alpha * alpha : undefined;
  const lambda = new Array(TARGET_POINTS).fill(0).map((_, x) => a0 + a1 * x + (a2 ? a2 * x * x : 0));

  // A(λ)
  const EPS = 1e-12;
  const A = I_sample.map((Is, i) => {
    const Id = I_dark[i] ?? 0;
    const Ir = I_ref[i] ?? 0;
    const Irp = Ir - Id;
    const Isp = Is - Id;
    if (!(Irp > 0) || !(Isp > 0)) return NaN;
    const T = Isp / (Irp || EPS);
    if (!(T > 0)) return NaN;
    return -Math.log10(T);
  });

  return { lambda, I_dark, I_ref, I_sample, A };
}
