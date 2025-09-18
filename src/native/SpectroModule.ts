import { useCallback, useRef } from 'react';
import { VisionCameraProxy, useFrameProcessor, type Frame } from 'react-native-vision-camera'; // eslint-disable-line import/no-unresolved
import { runOnJS } from 'react-native-reanimated';

export type RegionOfInterest = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type NormalizedRegionOfInterest = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SpectroRegionOfInterest = RegionOfInterest | NormalizedRegionOfInterest;

const PLUGIN_NAME = 'spectro_sum_columns';
let cachedPluginHandle: string | null = null;

const normalizeROI = (roi: SpectroRegionOfInterest): NormalizedRegionOfInterest => {
  if ('width' in roi && 'height' in roi) {
    return {
      x: Math.floor(roi.x),
      y: Math.floor(roi.y),
      width: Math.floor(roi.width),
      height: Math.floor(roi.height),
    };
  }

  return {
    x: Math.floor(roi.x),
    y: Math.floor(roi.y),
    width: Math.floor(roi.w),
    height: Math.floor(roi.h),
  };
};

export const spectroSumColumns = (
  frame: Frame,
  roi?: NormalizedRegionOfInterest,
): number[] => {
  'worklet';

  try {
    if (cachedPluginHandle == null) {
      const handle = VisionCameraProxy.initFrameProcessorPlugin(PLUGIN_NAME);
      cachedPluginHandle = typeof handle === 'string' ? handle : null;
    }

    if (cachedPluginHandle == null) {
      return [];
    }

    const options =
      roi != null
        ? {
            roi: {
              x: Math.max(0, roi.x),
              y: Math.max(0, roi.y),
              width: Math.max(0, roi.width),
              height: Math.max(0, roi.height),
            },
          }
        : undefined;

    // @ts-expect-error VisionCamera worklet API is not typed for direct JS usage.
    const result = VisionCameraProxy.callFrameProcessor(
      cachedPluginHandle,
      frame,
      options,
    ) as unknown;

    return Array.isArray(result) ? (result as number[]) : [];
  } catch {
    cachedPluginHandle = null;
    return [];
  }
};

export function useSpectroProcessor(
  roi: SpectroRegionOfInterest,
  onVector: (vector: number[]) => void,
) {
  const normalizedRoi = normalizeROI(roi);
  const { x, y, width, height } = normalizedRoi;

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      const sums = spectroSumColumns(frame, { x, y, width, height });
      if (!Array.isArray(sums) || sums.length === 0) {
        return;
      }

      runOnJS(onVector)(sums);
    },
    [x, y, width, height, onVector],
  );

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
    [targetFrames],
  );

  const waitBurst = useCallback(() => {
    accumulatorRef.current = [];
    return new Promise<number[][]>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  return { onVector, waitBurst };
}
