import { CurveGraphData } from "@/services/analysisService";
import { FinalResult } from "@/store/analysisStore";
import { ImageSourcePropType } from "react-native";
import z from "zod";

export  interface InfoCardData {
  title: string;
  subtitle: string;
  largeNumber?: string;
  smallIcon: ImageSourcePropType;
  route?: string;
}

export interface TypesAnalysisData {
    id: string;
    title: string;
    icon: string;
    subtitle: string;
    keyQuestion: string;
    explanation: string;
    howItWorks: string[];
    useCases: string[];
    enabled: boolean;
}

export const analysisSetupSchema = z
  .object({
    analysisName: z.string().min(1, "Nome da análise é obrigatório"),
    substance: z.string().min(1, "Substância é obrigatória"),
    wavelength: z.coerce
      .number()
      .min(200, "λ inválido")
      .max(1100, "λ inválido"),
    objective: z.string().optional(),
    hasDefinedCurve: z.boolean().default(false),
    hasCalibratedSpectrometer: z.boolean().default(false),
    selectedProfileId: z.string().optional(),
    slope_m: z.coerce.number().optional(),
    intercept_b: z.coerce.number().optional(),
  })
  .refine(
    (data) => {
      if (data.hasCalibratedSpectrometer) {
        return !!data.selectedProfileId;
      }
      return true;
    },
    {
      message: "Perfil espectrométrico é obrigatório",
      path: ["selectedProfileId"],
    }
  )
  .refine(
    (data) => {
      if (data.hasDefinedCurve)
        return data.slope_m != null && data.intercept_b != null;
      return true;
    },
    {
      message: "Coeficientes são obrigatórios.",
      path: ["slope_m"],
    }
  );

  
export type AnalysisSetupFormData = z.infer<typeof analysisSetupSchema>;

export interface CalibrationMeasurement {
  laserName: 'Vermelho' | 'Verde' | string;
  wavelengthNm: number;
  imageUris: string[]; 
}

export type AnalysisStatus = 'idle' |'configuring'| 'calibrating' | 'measuring' | 'fitting_curve' | 'processing' | 'success' | 'error';

export interface AnalysisReport {
  id: string; 
  savedAt: string;
  setupData: AnalysisSetupFormData;
  finalResult: FinalResult;
  graphData: CurveGraphData;
}