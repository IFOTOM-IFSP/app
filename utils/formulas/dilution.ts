export const calculateV1 = (values: Record<string, number | null>): { value?: number; error?: string } => {
  const { C1, C2, V2 } = values;
  if (C1 == null || C2 == null || V2 == null) return { error: "Valores insuficientes" };
  if (C1 === 0) return { error: "Divisão por zero" };
  return { value: (C2 * V2) / C1 };
};