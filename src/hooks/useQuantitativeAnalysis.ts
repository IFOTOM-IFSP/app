// src/hooks/useQuantitativeAnalysis.ts
import type { QuantAnalyzeResponse } from '@/types/api';
import type { AnalysisParams, Curve } from '@/types/types';
import { useCallback, useMemo } from 'react';
import { useAnalysisMachine } from '../features/analysis/AnalysisMachineProvider';
import { buildSavedAnalysis, useAnalysisHistory } from '../store/analysisHistoryStore';

type StartArgs = {
  params: AnalysisParams;
  providedCurve?: Curve | null;
};

export function useQuantitativeAnalysis() {
  const { state, send } = useAnalysisMachine();
  const hist = useAnalysisHistory();

  const step = useMemo(() => String(state.value), [state.value]);
  const ctx = state.context;

  // API “amigável” para a UI
  const start = useCallback((args: StartArgs) => {
    // a tela de “params” já chama SUBMIT_PARAMS; aqui fica à mão se quiser iniciar por fora:
    send({ type: 'SUBMIT_PARAMS', params: args.params, providedCurve: args.providedCurve ?? null });
  }, [send]);

  const next = useCallback(() => send({ type: 'NEXT' }), [send]);
  const retry = useCallback(() => send({ type: 'RETRY' }), [send]);
  const reset = useCallback(() => send({ type: 'RESET' }), [send]);

  // salva o resultado atual no histórico
  const saveToHistory = useCallback(() => {
    if (!ctx?.params || !ctx?.results) return;
    const saved = buildSavedAnalysis(
      ctx.params,
      ctx.results as QuantAnalyzeResponse,
      ctx.deviceProfile,
      ctx.resultsSource
    );
    hist.add(saved);
  }, [ctx?.params, ctx?.results, ctx?.deviceProfile, ctx?.resultsSource, hist]);

  return {
    step,
    ctx,
    error: ctx.error,
    results: ctx.results,
    resultsSource: ctx.resultsSource,
    start,
    next,
    retry,
    reset,
    saveToHistory,
    isProcessing: step === 'PROCESSING',
    isDone: step === 'DONE' || step === 'RESULTS',
  };
}
