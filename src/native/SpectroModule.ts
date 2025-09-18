import { useCallback, useRef } from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';

export type RegionOfInterest = {
  x: number;
  y: number;
  w: number;
  h: number;
};

declare global {
  const __visionCameraProxy: {
    frameProcessorPlugins?: Record<string, (...args: any[]) => unknown>;
  } | undefined;
}

export function useSpectroProcessor(roi: RegionOfInterest, onVector: (vector: number[]) => void) {
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    const plugin = globalThis.__visionCameraProxy?.frameProcessorPlugins?.spectro_sum_columns;
    if (!plugin) {
      return;
    }

    const sums = plugin(frame, roi.x, roi.y, roi.w, roi.h) as number[];
    runOnJS(onVector)(sums);
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
