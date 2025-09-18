import { useCallback, useRef } from "react";
import { runOnJS } from "react-native-reanimated";
import { useFrameProcessor } from "react-native-vision-camera";

type ROI = { x:number;y:number;w:number;h:number };

export function useBurstCapture(roi: ROI, frames = 10) {
  const acc = useRef<number[][]>([]);
  const resolver = useRef<(v:number[][])=>void>();

  const onVec = useCallback((vec: number[]) => {
    acc.current.push(vec);
    if (acc.current.length >= frames && resolver.current) {
      const out = acc.current;
      acc.current = [];
      resolver.current(out);
    }
  }, [frames]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // @ts-ignore
    const v = __visionCameraProxy.frameProcessorPlugins.spectro_sum_columns(frame, roi.x, roi.y, roi.w, roi.h);
    runOnJS(onVec)(v as number[]);
  }, [roi.x, roi.y, roi.w, roi.h, onVec]);

  const capture = () => new Promise<number[][]>((resolve) => { resolver.current = resolve; });

  return { frameProcessor, capture };
}
