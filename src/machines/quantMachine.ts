import { loadDeviceProfile, saveDeviceProfile } from '@/services/deviceProfile';
import { acquireStageVectors, acquireStandards, resampleBurstLinear } from '@/src/lib/acquisition';
import { MIN_R2, MIN_STANDARDS, validateCalibrationAcceptance, validatePreflight } from '@/src/lib/quality';
import { computeAStatsFromBursts } from '@/src/lib/quantCore';
import { quantifyHybrid, TARGET_POINTS } from '@/src/lib/quantEngine';
import type { QuantAnalyzeResponse } from '@/types/api';
import type { Acquisition, AnalysisParams, Curve, DeviceProfile, Matrix } from '@/types/types';
import { assign, createMachine, fromPromise } from 'xstate';

export type QuantContext = {
  analysisType?: 'quant';
  params?: AnalysisParams;
  deviceProfile: DeviceProfile | null;
  acquisition: Acquisition;
  curve: Curve | null;
  results?: QuantAnalyzeResponse;
  resultsSource?: 'api' | 'local';
  error?: string;
};

export type QuantEvent =
  | { type: 'SELECT_TYPE'; value: 'quant' }
  | { type: 'SUBMIT_PARAMS'; params: AnalysisParams; providedCurve?: Curve | null }
  | { type: 'DEVICE_PROFILE_READY'; profile: DeviceProfile }
  | { type: 'SKIP_DEVICE_CALIB' }
  | { type: 'NEXT' }
  | { type: 'RETRY' }
  | { type: 'QA_SAVE_PROFILE'; profile: DeviceProfile }
  | { type: 'QA_SAVE_RESULTS' }
  | { type: 'QA_SAVE_CURVE'; curve: Curve }
  | { type: 'RESET' };

export const quantMachine = createMachine({
  types: {} as { context: QuantContext; events: QuantEvent },
  id: 'ifotom-quant',
  initial: 'CHOOSE_TYPE',
  context: {
    analysisType: undefined,
    params: undefined,
    deviceProfile: null,
    acquisition: {},
    curve: null,
    results: undefined,
    resultsSource: undefined,
    error: undefined,
  },
  states: {
    CHOOSE_TYPE: {
      on: {
        SELECT_TYPE: {
          target: 'PARAMS',
          actions: assign({ analysisType: 'quant' as const, error: undefined }),
        },
      },
    },

    PARAMS: {
      invoke: {
        id: 'loadProfile',
        src: fromPromise(async () => await loadDeviceProfile()),
        onDone: { actions: assign(({ event }) => ({ deviceProfile: (event as any).output })) },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
      on: {
        SUBMIT_PARAMS: {
          target: 'PREFLIGHT',
          actions: assign(({ event }) => ({
            params: (event as any).params,
            curve: (event as any).providedCurve ?? null,
            error: undefined,
          })),
        },
      },
    },

    PREFLIGHT: {
      invoke: {
        id: 'preflight',
        src: fromPromise(async ({ input }) => {
          const ctx = input as QuantContext;
          const res = validatePreflight(ctx.deviceProfile, ctx.deviceProfile?.roi as any);
          if (!res.ok) throw new Error(res.issues.join(' | '));
          return res; // sugestões podem ser mostradas na UI
        }),
        input: ({ context }) => context,
        onDone: { target: 'DECIDE_CALIB_DEVICE' },
        onError: {
          target: 'PARAMS',
          actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })),
        },
      },
    },

    DECIDE_CALIB_DEVICE: {
      always: [
        { target: 'CALIB_DEVICE', guard: ({ context }) => !context.deviceProfile },
        { target: 'ACQ_DARK_NOISE' },
      ],
    },

    CALIB_DEVICE: {
      on: {
        DEVICE_PROFILE_READY: {
          target: 'ACQ_DARK_NOISE',
          actions: assign(({ event }) => ({ deviceProfile: (event as any).profile })),
        },
        SKIP_DEVICE_CALIB: { target: 'ACQ_DARK_NOISE' },
      },
    },

    ACQ_DARK_NOISE: {
      invoke: {
        id: 'acqDark',
        src: fromPromise(async ({ input }) => {
          const { params } = input as { params: AnalysisParams };
          if (!params) throw new Error('params missing');
          const darkNoise = await acquireStageVectors(params, 'darkNoise');
          return { darkNoise };
        }),
        input: ({ context }) => ({ params: context.params }),
        onDone: {
          target: 'ACQ_WHITE_NOISE',
          actions: assign(({ context, event }) => ({
            acquisition: {
              ...context.acquisition,
              darkNoise: resampleBurstLinear((event as any).output.darkNoise as Matrix, TARGET_POINTS),
            },
          })),
        },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
      on: { RETRY: undefined },
    },

    ACQ_WHITE_NOISE: {
      invoke: {
        id: 'acqWhite',
        src: fromPromise(async ({ input }) => {
          const { params } = input as { params: AnalysisParams };
          if (!params) throw new Error('params missing');
          const whiteNoise = await acquireStageVectors(params, 'whiteNoise');
          return { whiteNoise };
        }),
        input: ({ context }) => ({ params: context.params }),
        onDone: {
          target: 'ACQ_REF1',
          actions: assign(({ context, event }) => ({
            acquisition: {
              ...context.acquisition,
              whiteNoise: resampleBurstLinear((event as any).output.whiteNoise as Matrix, TARGET_POINTS),
            },
          })),
        },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
    },

    ACQ_REF1: {
      invoke: {
        id: 'acqRef1',
        src: fromPromise(async ({ input }) => {
          const { params } = input as { params: AnalysisParams };
          if (!params) throw new Error('params missing');
          const ref1 = await acquireStageVectors(params, 'ref1');
          return { ref1 };
        }),
        input: ({ context }) => ({ params: context.params }),
        onDone: {
          target: 'DECIDE_CURVE',
          actions: assign(({ context, event }) => ({
            acquisition: {
              ...context.acquisition,
              ref1: resampleBurstLinear((event as any).output.ref1 as Matrix, TARGET_POINTS),
            },
          })),
        },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
    },

    DECIDE_CURVE: {
      always: [
        { target: 'CALIB_CURVE', guard: ({ context }) => !!context.params?.build_curve },
        { target: 'ACQ_SAMPLE' },
      ],
    },

    CALIB_CURVE: {
      invoke: {
        id: 'acqStandards',
        src: fromPromise(async ({ input }) => {
          const { params } = input as { params: AnalysisParams };
          if (!params) throw new Error('params missing');
          const standards = await acquireStandards(params);
          return { standards };
        }),
        input: ({ context }) => ({ params: context.params }),
        onDone: {
          target: 'BUILD_CURVE',
          actions: assign(({ context, event }) => {
            const sts = (event as any).output.standards || [];
            const mapped = sts.map((s: any) => ({
              C: s.C,
              darkNoise: resampleBurstLinear(s.darkNoise, TARGET_POINTS),
              whiteNoise: resampleBurstLinear(s.whiteNoise, TARGET_POINTS),
              ref:       resampleBurstLinear(s.ref, TARGET_POINTS),
              sample:    resampleBurstLinear(s.sample, TARGET_POINTS),
            }));
            return { acquisition: { ...context.acquisition, standards: mapped } };
          }),
        },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
    },

    BUILD_CURVE: {
      on: { NEXT: 'ACQ_SAMPLE' },
    },

    ACQ_SAMPLE: {
      invoke: {
        id: 'acqSample',
        src: fromPromise(async ({ input }) => {
          const { params } = input as { params: AnalysisParams };
          if (!params) throw new Error('params missing');
          const sample = await acquireStageVectors(params, 'sample');
          return { sample };
        }),
        input: ({ context }) => ({ params: context.params }),
        onDone: {
          target: 'ACQ_REF2',
          actions: assign(({ context, event }) => ({
            acquisition: {
              ...context.acquisition,
              sample: resampleBurstLinear((event as any).output.sample as Matrix, TARGET_POINTS),
            },
          })),
        },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
    },

    ACQ_REF2: {
      invoke: {
        id: 'acqRef2',
        src: fromPromise(async ({ input }) => {
          const { params } = input as { params: AnalysisParams };
          if (!params) throw new Error('params missing');
          const ref2 = await acquireStageVectors(params, 'ref2');
          return { ref2 };
        }),
        input: ({ context }) => ({ params: context.params }),
        onDone: {
          target: 'PROCESSING',
          actions: assign(({ context, event }) => ({
            acquisition: {
              ...context.acquisition,
              ref2: resampleBurstLinear((event as any).output.ref2 as Matrix, TARGET_POINTS),
            },
          })),
        },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
    },

    PROCESSING: {
      invoke: {
        id: 'quantify',
        src: fromPromise(async ({ input }) => {
          const ctx = input as QuantContext;
          if (!ctx.params || !ctx.deviceProfile) throw new Error('missing params/profile');

          // Validação da curva construída agora (n, faixa A, R², WLS opcional)
          if (!ctx.curve && ctx.acquisition.standards?.length) {
            const origW = ctx.deviceProfile.roi.w;
            const alpha = (origW > 1 && TARGET_POINTS > 1) ? (origW - 1) / (TARGET_POINTS - 1) : 1;
            const p2wScaled = {
              a0: ctx.deviceProfile.pixel_to_nm.a0,
              a1: (ctx.deviceProfile.pixel_to_nm.a1 ?? 0) * alpha,
              a2: ctx.deviceProfile.pixel_to_nm.a2 != null
                ? ctx.deviceProfile.pixel_to_nm.a2 * alpha * alpha
                : undefined,
            };

            const points = ctx.acquisition.standards!.map(s => {
              const { A_mean, A_sd } = computeAStatsFromBursts(
                s.darkNoise!, s.ref!, s.sample!,
                p2wScaled,
                ctx.params!.lambda_nm,
                ctx.params!.window_nm
              );
              return { C: s.C, A_mean, A_sd };
            });

            const acc = validateCalibrationAcceptance(points, {
              minPoints: MIN_STANDARDS,
              minR2: MIN_R2,
              useWLS: true,
            });
            if (!acc.ok) throw new Error('Curva reprovada: ' + acc.issues.join(' | '));
          }

          // Estratégia de execução
          const strategy = ctx.params.useLocalCore ? 'local' : 'auto';

          // Normalização do shape da curva (range cmin/cmax)
          const curveNormalized = ctx.curve
            ? {
                m: ctx.curve.m,
                b: ctx.curve.b,
                s_m: (ctx.curve as any).s_m,
                s_b: (ctx.curve as any).s_b,
                range: ctx.curve.range
                  ? {
                      cmin: (ctx.curve.range as any).cmin ?? (ctx.curve.range as any).Cmin,
                      cmax: (ctx.curve.range as any).cmax ?? (ctx.curve.range as any).Cmax,
                    }
                  : undefined,
              }
            : null;

          const { result, source } = await quantifyHybrid(
            {
              params: ctx.params,
              deviceProfile: {
                device_hash: ctx.deviceProfile.device_hash,
                pixel_to_nm: ctx.deviceProfile.pixel_to_nm,
                rmse_nm: ctx.deviceProfile.rmse_nm,
                roi: ctx.deviceProfile.roi,
                camera_meta: ctx.deviceProfile.camera_meta,
              },
              acquisition: {
                darkNoise: ctx.acquisition.darkNoise!,
                whiteNoise: ctx.acquisition.whiteNoise,
                ref1: ctx.acquisition.ref1!,
                sample: ctx.acquisition.sample!,
                ref2: ctx.acquisition.ref2,
                standards: ctx.acquisition.standards?.map(s => ({
                  C: s.C,
                  darkNoise: s.darkNoise!,
                  ref: s.ref!,
                  sample: s.sample!,
                })),
              },
              curve: curveNormalized,
            },
            strategy
          );

          return { result, _source: source };
        }),
        input: ({ context }) => context,
        onDone: {
          target: 'RESULTS',
          actions: assign(({ event }) => ({
            results: (event as any).output.result,
            resultsSource: (event as any).output._source,
          })),
        },
        onError: { actions: assign(({ event }) => ({ error: String((event as any).output ?? event) })) },
      },
      on: { RETRY: 'ACQ_SAMPLE' },
    },

    RESULTS: {
      on: {
        QA_SAVE_PROFILE: {
          actions: assign(({ event }) => {
            const profile = (event as any).profile as DeviceProfile;
            saveDeviceProfile(profile);
            return { deviceProfile: profile };
          }),
        },
        QA_SAVE_RESULTS: { target: 'QA_SAVE' },
        QA_SAVE_CURVE: { actions: assign(({ event }) => ({ curve: (event as any).curve })) },
        NEXT: 'DONE',
      },
    },

    QA_SAVE: { on: { NEXT: 'DONE' } },

    DONE: {
      on: {
        RESET: {
          target: 'CHOOSE_TYPE',
          actions: assign(() => ({
            analysisType: undefined,
            params: undefined,
            acquisition: {},
            curve: null,
            results: undefined,
            resultsSource: undefined,
            error: undefined,
          })),
        },
      },
    },
  },
});
