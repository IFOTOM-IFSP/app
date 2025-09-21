import { loadDeviceProfile } from '@/services/deviceProfile';
import { acquireStageVectors, resampleBurstLinear } from '@/src/lib/acquisition';
import { computeAStatsFromBursts } from '@/src/lib/quantCore';
import { TARGET_POINTS } from '@/src/lib/quantEngine';
import type { AnalysisParams } from '@/types/types';

export type SimpleReadingResult = {
  A_mean: number;
  A_sd: number;
  CV: number;
  used: {
    lambda_nm: number;
    window_nm: number;
    frames_per_burst: number;
    points: number; // 2048
  };
  notes?: string[];
};

export async function runSimpleReading(params: Pick<AnalysisParams,
  'lambda_nm' | 'window_nm' | 'frames_per_burst'
>) : Promise<{ result: SimpleReadingResult }> {
  const profile = await loadDeviceProfile();
  if (!profile) throw new Error('Perfil do dispositivo ausente');

  // captura
  const dark  = await acquireStageVectors({ ...params, name: 'Simple', build_curve: false, useLocalCore: true, standards: [] } as any, 'darkNoise');
  const ref1  = await acquireStageVectors({ ...params, name: 'Simple', build_curve: false, useLocalCore: true, standards: [] } as any, 'ref1');
  const sample= await acquireStageVectors({ ...params, name: 'Simple', build_curve: false, useLocalCore: true, standards: [] } as any, 'sample');

  // reamostra
  const darkR   = resampleBurstLinear(dark,   TARGET_POINTS);
  const ref1R   = resampleBurstLinear(ref1,   TARGET_POINTS);
  const sampleR = resampleBurstLinear(sample, TARGET_POINTS);

  // reescala do px→λ para 2048
  const origW = profile.roi.w;
  const alpha = (origW > 1 && TARGET_POINTS > 1) ? (origW - 1)/(TARGET_POINTS - 1) : 1;
  const p2w = {
    a0: profile.pixel_to_nm.a0,
    a1: (profile.pixel_to_nm.a1 ?? 0) * alpha,
    a2: profile.pixel_to_nm.a2 != null ? profile.pixel_to_nm.a2 * alpha * alpha : undefined,
  };

  // estatísticas locais
  const { A_mean, A_sd } = computeAStatsFromBursts(
    darkR, ref1R, sampleR,
    p2w,
    params.lambda_nm,
    params.window_nm ?? 4
  );
  const CV = Math.abs(A_mean) > 1e-12 ? (A_sd / Math.abs(A_mean)) * 100 : NaN;

  return {
    result: {
      A_mean, A_sd, CV,
      used: {
        lambda_nm: params.lambda_nm,
        window_nm: params.window_nm ?? 4,
        frames_per_burst: params.frames_per_burst,
        points: TARGET_POINTS
      }
    }
  };
}
