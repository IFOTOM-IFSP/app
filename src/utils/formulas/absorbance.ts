export const calculateAbsorbance = (transmittance: number): number => {
  if (transmittance <= 0) return Infinity;
  return -Math.log10(transmittance / 100);
};
export const calculateTransmittance = (absorbance?: number): number | null => {
  if (absorbance === undefined || absorbance === null) return null;
  return 100 * Math.pow(10, -absorbance);
};
export const calculateBeerLambert = (values: Record<string, number>): number => {
  const { epsilon, l, c } = values;
  if (epsilon != null && l != null && c != null) {
    return epsilon * l * c;
  }
  return 0;
};

export const calculateConcentration = (values: { A?: number, epsilon?: number, l?: number }): number | null => {
  const { A, epsilon, l } = values;
  if (A === undefined || epsilon === undefined || l === undefined || epsilon <= 0 || l <= 0) return null;
  return A / (epsilon * l);
}