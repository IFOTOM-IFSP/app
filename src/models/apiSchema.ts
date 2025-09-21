import { z } from "zod";

export const ROISchema = z.object({ x: z.number().int(), y: z.number().int(), w: z.number().int(), h: z.number().int() });

export const SpectralBurstSchema = z.object({
  vectors: z.array(z.array(z.number())),
  timestamps_ms: z.array(z.number()).optional(),
});

export const ImageBurstSchema = z.object({
  frames_base64: z.array(z.string()),
  timestamps_ms: z.array(z.number()).optional(),
});

export const PixelToWavelengthSchema = z.object({
  coeffs: z.array(z.number()).min(2).max(3),
  rmse_nm: z.number().optional(),
  dispersion_nm_per_px: z.number().optional()
});

export const CalibrationCurveInputSchema = z.object({
  slope: z.number(),
  intercept: z.number(),
  r_squared: z.number().optional(),
  s_m: z.number().optional(),
  s_b: z.number().optional(),
  lod: z.number().optional(),
  loq: z.number().optional(),
});

export const ReferenceProcessingReqSchema = z.object({
  dark: z.union([SpectralBurstSchema, ImageBurstSchema]),
  white: z.union([SpectralBurstSchema, ImageBurstSchema]),
  roi: ROISchema.optional()
});

export const AnalysisReqSchema = z.object({
  analysisType: z.enum(['quantitative','simple_read','scan','kinetic']),
  pixel_to_wavelength: PixelToWavelengthSchema.optional(),
  calibration_curve: CalibrationCurveInputSchema.optional(),
  target_wavelength: z.number().optional(),
  window_nm: z.number().default(4),
  roi: ROISchema.optional(),
  dark_reference_spectrum: z.array(z.tuple([z.number().int(), z.number()])),
  white_reference_spectrum: z.array(z.tuple([z.number().int(), z.number()])),
  samples: z.array(z.object({
    kind: z.enum(['standard','unknown']),
    burst: z.union([SpectralBurstSchema, ImageBurstSchema]),
    concentration: z.number().optional(),
    dilution_factor: z.number().default(1)
  }))
});

export type AnalysisReq = z.infer<typeof AnalysisReqSchema>;
