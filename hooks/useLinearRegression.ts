import { useMemo } from 'react';
export type Point = { x: number; y: number };

const calculateLinearRegression = (data: Point[]) => {
  if (data.length < 2) {
    return { slope: 0, intercept: 0, r2: 0, linePoints: [] as Point[] };
  }

  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
    sumY2 += point.y * point.y;
  }
  
  const denominator = (n * sumX2 - sumX * sumX);
  if (denominator === 0) return { slope: 0, intercept: 0, r2: 0, linePoints: [] };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  
  const rNumerator = n * sumXY - sumX * sumY;
  const rDenominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  const r = rDenominator === 0 ? 0 : rNumerator / rDenominator;
  const r2 = r * r;

  const xValues = data.map((p) => p.x);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  
  const linePoints: Point[] = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  return { slope, intercept, r2, linePoints };
};

export const useLinearRegression = (points: Point[]) => {
  return useMemo(() => calculateLinearRegression(points), [points]);
};