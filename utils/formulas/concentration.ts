export const convertMolToMassConc = (molarConc?: number, molarMass?: number): number | null => {
  if (molarConc === undefined || molarMass === undefined || molarMass <= 0) return null;
  const massConcInGramsPerLiter = molarConc * molarMass;
  return massConcInGramsPerLiter; // Retorna em mg/mL
};


export const convertMassToMolConc = (massConc?: number, molarMass?: number): number | null => {
  if (massConc === undefined || molarMass === undefined || molarMass <= 0) return null;
  return massConc / molarMass;
};