import { z } from 'zod';

export type AnalysisStep =
  | 'setup'
  | 'dark_frame'
  | 'white_frame'
  | 'processing_references'
  | 'calibration_standards_capture'
  | 'processing_curve'
  | 'sample_capture'
  | 'processing_final'
  | 'results'
  | 'error';

export type AnalysisType = 'quantitative' | 'scan' | 'simple_read' | 'kinetic';

const quantitativeSetupSchema = z.object({
  analysisType: z.literal('quantitative'),
  analysisName: z.string().min(1, "O nome da análise é obrigatório."),
  analyteName: z.string().optional(),
  solvent: z.string().optional(),
  unit: z.string().min(1, "A unidade é obrigatória."),
  targetWavelength: z.coerce.number({ required_error: "Obrigatório" }).positive("Deve ser um número positivo."),
  
  opticalPath: z.coerce.number().positive().default(1),
  
  useCalibrationCurve: z.boolean().default(false), // .default() para booleano é geralmente seguro.
  slope: z.coerce.number({ invalid_type_error: "Deve ser um número." }).optional(),
  intercept: z.coerce.number({ invalid_type_error: "Deve ser um número." }).optional(),
});

const scanSetupSchema = z.object({
  analysisType: z.literal('scan'),
  analysisName: z.string().min(1, "O nome é obrigatório."),
  analyteName: z.string().optional(),
  opticalPath: z.coerce.number().positive().default(1),
  startWavelength: z.coerce.number({ required_error: "Obrigatório" }),
  endWavelength: z.coerce.number({ required_error: "Obrigatório" }),
});

const kineticSetupSchema = z.object({
  analysisType: z.literal('kinetic'),
  analysisName: z.string().min(1, "Obrigatório"),
  analyteName: z.string().optional(),
  opticalPath: z.coerce.number().positive().default(1),
  targetWavelength: z.coerce.number({ required_error: "Obrigatório" }).positive(),
  durationSec: z.coerce.number({ required_error: "Obrigatório" }).int("Deve ser um número inteiro.").positive(),
  intervalSec: z.coerce.number({ required_error: "Obrigatório" }).int("Deve ser um número inteiro.").positive(),
});

const simpleReadSetupSchema = z.object({
  analysisType: z.literal('simple_read'),
  analysisName: z.string().min(1, "Obrigatório"),
  analyteName: z.string().optional(),
  opticalPath: z.coerce.number().positive().default(1),
  targetWavelength: z.coerce.number({ required_error: "Obrigatório" }).positive(),
});




export const analysisSetupMasterSchema = z.discriminatedUnion('analysisType', [
  quantitativeSetupSchema,
  scanSetupSchema,
  kineticSetupSchema,
  simpleReadSetupSchema,
])
.refine((data) => {
  if (data.analysisType === 'scan') {
    return data.endWavelength > data.startWavelength;
  }
  return true;
}, {
  message: "O valor final deve ser maior que o inicial.",
  path: ["endWavelength"], 
})
.superRefine((data, ctx) => {
  if (data.analysisType === 'quantitative' && data.useCalibrationCurve) {
    if (data.slope === undefined || isNaN(data.slope)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "O Slope é obrigatório.", path: ["slope"] });
    }
    if (data.intercept === undefined || isNaN(data.intercept)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "O Intercepto é obrigatório.", path: ["intercept"] });
    }
  }
});

export type AnalysisSetup = z.infer<typeof analysisSetupMasterSchema>;

export interface SampleData {
  id: string; 
  type: 'standard' | 'unknown';
  label?: string;
  uris: string[];
  concentration?: number;
  dilution_factor?: number;
  timestamps_sec?: number[];
}

export interface AnalysisResult {
  calibrationCurve?: {
    rSquared: number;
    equation: string;
    slope: number;
    intercept: number;
  };
  sampleResults: {
    sampleId: string; 
    label?: string; 
    sampleAbsorbance?: number;
    calculatedConcentration?: number;
    spectrumData?: [number, number][]; 
    kineticData?: [number, number][];  
  }[];
}

export interface AnalysisSession {
  id: string; 
  setup: AnalysisSetup; 
  currentStep: AnalysisStep;
  darkFrameUris: string[];
  whiteFrameUris: string[];
  capturedSamples: SampleData[]; 
  processedDarkSpectrum: [number, number][] | null;
  processedWhiteSpectrum: [number, number][] | null;
  wavelengthCoeffs: number[] | null;
  result?: AnalysisResult;
  error?: string; 
  createdAt: string;
  finishedAt?: string;
}