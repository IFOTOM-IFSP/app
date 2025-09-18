import { useCallback, useRef } from 'react';
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

declare global {
  var __spectroSumColumnsPlugin: FrameProcessorPlugin | undefined;
}

const PLUGIN_NAME = 'spectro_sum_columns';

type PluginResult = number[] | undefined;

export function useSpectroProcessor(roi: RegionOfInterest, onVector: (vector: number[]) => void) {
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    let plugin = globalThis.__spectroSumColumnsPlugin;
    if (plugin == null) {
      try {
        plugin = VisionCameraProxy.initFrameProcessorPlugin(PLUGIN_NAME, {});
        globalThis.__spectroSumColumnsPlugin = plugin;
      } catch {
        plugin = undefined;
      }
    }

    if (plugin == null) {
      return;
    }

    let result: PluginResult;
    try {
      result = plugin.call(frame, {
        x: roi.x,
        y: roi.y,
        w: roi.w,
        h: roi.h,
      }) as unknown as PluginResult;
    } catch {
      return;
    }

    if (!Array.isArray(result)) {
      return;
    }

    runOnJS(onVector)(result);
  }, [roi.x, roi.y, roi.w, roi.h, onVector]);

  return frameProcessor;
}

export function useBurstCollector(targetFrames = 10) {
  const accumulatorRef = useRef<number[][]>([]);
  const resolverRef = useRef<((vectors: number[][]) => void) | null>(null);

  const onVector = useCallback(
    (vector: number[]) => {
      const accumulator = accumulatorRef.current;
      accumulator.push(vector);
      if (accumulator.length >= targetFrames && resolverRef.current) {
        const output = [...accumulator];
        accumulator.length = 0;
        const resolve = resolverRef.current;
        resolverRef.current = null;
        resolve(output);
      }
    },
    [targetFrames]
  );

  const waitBurst = useCallback(() => {
    accumulatorRef.current = [];
    return new Promise<number[][]>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  return { onVector, waitBurst };
}
