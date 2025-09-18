import { useCallback, useEffect, useRef } from 'react';
import {
  VisionCameraProxy,
  useFrameProcessor,
  type FrameProcessorPlugin,
} from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';

export type RegionOfInterest = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CaptureBurstOptions = {
  timeoutMs?: number;
};

declare global {
  // Cache initialized frame processor plugins inside the worklet runtime.
  var __spectroSumColumnsPlugin: FrameProcessorPlugin | undefined;
  // VisionCamera < 4.0 exposed plugins on a global proxy – keep a fallback for that runtime.
  var __visionCameraProxy:
    | {
        frameProcessorPlugins?: Record<string, (...args: unknown[]) => unknown>;
      }
    | undefined;
}

const PLUGIN_NAME = 'spectro_sum_columns';

export function useSpectroProcessor(roi: RegionOfInterest, onVector: (vector: number[]) => void) {
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    const asNumberArray = (value: unknown): number[] | null => {
      'worklet';
      if (!Array.isArray(value)) {
        return null;
      }
      for (let index = 0; index < value.length; index += 1) {
        if (typeof value[index] !== 'number') {
          return null;
        }
      }
      return value as number[];
    };

    let plugin = globalThis.__spectroSumColumnsPlugin;
    if (plugin == null) {
      try {
        const initialized = VisionCameraProxy.initFrameProcessorPlugin(PLUGIN_NAME, {});
        if (initialized != null) {
          plugin = initialized;
          globalThis.__spectroSumColumnsPlugin = initialized;
        }
      } catch {
        plugin = undefined;
      }
    }

    if (plugin != null) {
      let result: unknown;
      try {
        result = plugin.call(frame, {
          x: roi.x,
          y: roi.y,
          w: roi.w,
          h: roi.h,
        });
      } catch {
        return;
      }

      const values = asNumberArray(result);
      if (values != null) {
        runOnJS(onVector)(values);
      }
      return;
    }

    const legacyProxy = globalThis.__visionCameraProxy;
    const legacyPlugin = legacyProxy?.frameProcessorPlugins?.[PLUGIN_NAME];
    if (typeof legacyPlugin !== 'function') {
      return;
    }

    let legacyResult: unknown;
    try {
      legacyResult = legacyPlugin(frame, roi.x, roi.y, roi.w, roi.h);
    } catch {
      return;
    }

    const legacyValues = asNumberArray(legacyResult);
    if (legacyValues != null) {
      runOnJS(onVector)(legacyValues);
    }
  }, [roi.x, roi.y, roi.w, roi.h, onVector]);

  return frameProcessor;
}

export function useBurstCollector(targetFrames = 10) {
  const framesToCollect = Math.max(1, targetFrames);
  const accumulatorRef = useRef<number[][]>([]);
  const resolverRef = useRef<((vectors: number[][]) => void) | null>(null);

  const cancel = useCallback(() => {
    resolverRef.current = null;
    accumulatorRef.current = [];
  }, []);

  useEffect(() => cancel, [cancel]);

  const onVector = useCallback(
    (vector: number[]) => {
      const resolve = resolverRef.current;
      if (!resolve) {
        return;
      }
      const accumulator = accumulatorRef.current;
      accumulator.push(vector);
      if (accumulator.length >= framesToCollect) {
        resolverRef.current = null;
        const output = accumulator.slice();
        accumulatorRef.current = [];
        resolve(output);
      }
    },
    [framesToCollect]
  );

  const waitBurst = useCallback(() => {
    cancel();
    return new Promise<number[][]>((resolve) => {
      resolverRef.current = resolve;
    });
  }, [cancel]);

  return { onVector, waitBurst, cancel };
}

export function useSpectroBurst(roi: RegionOfInterest, targetFrames = 10) {
  const { onVector, waitBurst, cancel } = useBurstCollector(targetFrames);
  const frameProcessor = useSpectroProcessor(roi, onVector);

  const captureBurst = useCallback(
    async ({ timeoutMs }: CaptureBurstOptions = {}) => {
      if (timeoutMs != null && timeoutMs <= 0) {
        cancel();
        throw new Error('captureBurst timed out');
      }

      const pendingBurst = waitBurst();
      if (timeoutMs == null) {
        return pendingBurst;
      }

      return await new Promise<number[][]>((resolve, reject) => {
        let settled = false;
        const timeoutHandle: ReturnType<typeof setTimeout> = setTimeout(() => {
          if (settled) {
            return;
          }
          settled = true;
          cancel();
          reject(new Error('captureBurst timed out'));
        }, timeoutMs);

        pendingBurst.then(
          (vectors) => {
            if (settled) {
              return;
            }
            settled = true;
            clearTimeout(timeoutHandle);
            resolve(vectors);
          },
          (error) => {
            if (settled) {
              return;
            }
            settled = true;
            clearTimeout(timeoutHandle);
            reject(error);
          }
        );
      });
    },
    [waitBurst, cancel]
  );

  return {
    frameProcessor,
    captureBurst,
    cancelBurst: cancel,
  };
}
