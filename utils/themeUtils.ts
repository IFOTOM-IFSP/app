
import { type SchemeType } from "@/context/ThemeContext";


export const getSchemeLabel = (scheme: SchemeType): string => {
  if (scheme === "light") return "Claro";
  if (scheme === "dark") return "Escuro";
  return "Sistema";
};
