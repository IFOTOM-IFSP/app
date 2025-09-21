import type { QuantAnalyzeResponse } from '@/types/api';
import type { AnalysisParams } from '@/types/types';

export type SpectrumSeries = {
  name: 'dark' | 'white_noise' | 'ref' | 'sample';
  y: number[];
};

export type SpectrumPlotModel = {
  x: number[]; // lambda (nm)
  series: SpectrumSeries[];
  window?: { center: number; half: number };
};

export function buildSpectrumPlotModel(resp: QuantAnalyzeResponse | undefined, params?: AnalysisParams): SpectrumPlotModel {
  const spec = resp?.spectrum;
  const x = spec?.lambda ?? [];
  const series: SpectrumSeries[] = [];
  if (spec?.I_dark)        series.push({ name: 'dark',        y: spec.I_dark });
  if (spec?.I_white_noise) series.push({ name: 'white_noise', y: spec.I_white_noise });
  if (spec?.I_ref)         series.push({ name: 'ref',         y: spec.I_ref });
  if (spec?.I_sample)      series.push({ name: 'sample',      y: spec.I_sample });
  const half = params?.window_nm ? params.window_nm / 2 : undefined;
  const window = params && half ? { center: params.lambda_nm, half } : undefined;
  return { x, series, window };
}
