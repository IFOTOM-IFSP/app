
import { type SchemeType } from "@/src/store/ThemeContext";


export const getSchemeLabel = (scheme: SchemeType): string => {
  if (scheme === "light") return "Claro";
  if (scheme === "dark") return "Escuro";
  return "Sistema";
};
