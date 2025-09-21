// types/api.ts

export type PixelToWavelength = { a0: number; a1: number; a2?: number; rmse_nm?: number };

export type CalibrationCurve = {
  m: number; b: number; R2?: number; SEE?: number; s_m?: number; s_b?: number;
  LOD?: number; LOQ?: number; range?: { cmin: number; cmax: number };
};

export type ReferenceBurst = { frames: number[][] };

// ============= /analysis/quant =============
export type QuantAnalyzeRequest = {
  lambda_nm: number;
  window_nm?: number;
  device_profile: {
    device_hash: string;
    pixel_to_wavelength: PixelToWavelength;
    roi: { x: number; y: number; width: number; height: number };
    camera_meta?: { iso?: number; shutter_ms?: number; wb?: string };
  };
  calibration:
    | { m: number; b: number }
    | { standards: { C: number; A_mean: number; A_sd?: number }[] };

  // bursts
  dark: ReferenceBurst;
  white_noise?: ReferenceBurst;  // ruído branco (QA)
  ref: ReferenceBurst;           // blank (100% T)
  sample: ReferenceBurst;

  // pseudo double-beam
  pseudo_double_beam?: { ref_after?: ReferenceBurst };
};

export type QAFlags = {
  saturation: boolean;
  outliers: number;
  in_range: boolean;
  drift: boolean;
  notes?: string[];
};

export type QuantAnalyzeResponse = {
  A_mean: number; A_sd: number; CV: number;
  C: number;
  CI95?: { low: number; high: number };
  QA: QAFlags;
  spectrum?: {
    lambda: number[];
    I_dark?: number[];
    I_white_noise?: number[];   // opcional, se a API usar/retornar
    I_ref?: number[];
    I_sample?: number[];
    window_nm?: number;
  };
  calib?: CalibrationCurve;
};

// ============= /instrument/characterize =============
export type CharacterizeRequest = {
  frames_red: number[][];
  frames_green: number[][];
  frames_blue?: number[][];

  // dicas (opcional): comprimentos de onda esperados dos lasers
  hints?: { nm_red?: number; nm_green?: number; nm_blue?: number };

  // ROI em coordenadas de imagem
  roi: { x: number; y: number; width: number; height: number };

  // metadados de câmera (opcional)
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string };
};

export type CharacterizeResponse = {
  pixel_to_nm: { a0: number; a1: number; a2?: number }; // mapeamento px→λ
  rmse_nm: number;                                      // erro da calibração
  roi: { x: number; y: number; width: number; height: number };
  dispersion_nm_per_px: number;
  device_hash: string;
  peaks: { red_px?: number; green_px?: number; blue_px?: number };
};
