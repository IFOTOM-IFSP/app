
import { type SchemeType } from "@/state/ThemeContext";


export const getSchemeLabel = (scheme: SchemeType): string => {
  if (scheme === "light") return "Claro";
  if (scheme === "dark") return "Escuro";
  return "Sistema";
};
