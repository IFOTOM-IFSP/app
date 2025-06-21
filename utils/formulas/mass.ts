
export const calculateMass = (values: Record<string, number | null>): { value?: number; error?: string } => {
  const { M, V, MM } = values;
  if (M == null || V == null || MM == null)
        return { error: "Valores insuf." };
  return { value: M * V * MM };
};