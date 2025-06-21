export const calculateAbsorbance = (transmittance: number): number => {
  if (transmittance <= 0) return Infinity;
  return -Math.log10(transmittance / 100);
};

export const calculateBeerLambert = (values: Record<string, number>): number => {
  const { epsilon, l, c } = values;
  if (epsilon != null && l != null && c != null) {
    return epsilon * l * c;
  }
  return 0;
};