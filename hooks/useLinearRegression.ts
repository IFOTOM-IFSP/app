import { calculateLinearRegression, type Point } from '@/utils/math/linearRegression';
import { useMemo } from 'react';

export type { Point };

export const useLinearRegression = (points: Point[]) => {
  return useMemo(() => calculateLinearRegression(points), [points]);
};