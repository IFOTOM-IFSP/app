export type Matrix = number[][]; 
export type Vector = number[];

export type ROI = { x: number; y: number; w: number; h: number };

export type PixelToNm = { a0: number; a1: number; a2?: number };

export type DeviceProfile = {
  pixel_to_nm: PixelToNm;
  rmse_nm?: number;                // erro da calibração de λ (lasers)
  roi: ROI;                        // w/h aqui; na API vira width/height
  dispersion_nm_per_px?: number;   // opcional (diagnóstico)
  device_hash: string;             // modelo/lente/app version hash
  camera_meta?: { iso?: number; shutter_ms?: number; wb?: string } | Record<string, string>;
};

export type ProcessingMode = 'auto' | 'local' | 'api';

export type AnalysisParams = {
  name: string;
  substance?: string;

  lambda_nm: number;
  window_nm?: number;                // largura total da janela (ex.: 4 → ±2 nm)

  frames_per_burst?: number;         // default 10 (o Acquisition aplica)
  build_curve?: boolean;             // construir curva agora (Cenário 3)
  standards?: { C: number }[];       // concentrações alvo para padrões

  processingMode?: ProcessingMode;   // 'auto' (default), 'local' (preview/offline), 'api'
  useLocalCore?: boolean;            // (deprecated) preferir processingMode

  acceptance?: {
    minR2?: number;                  // default 0.995
    minStandards?: number;           // default 5
    linearAmin?: number;             // default 0.05
    linearAmax?: number;             // default 1.5
  };

  saturation_guard?: {
    lowPct?: number;                 // default 0.12
    highPct?: number;                // default 0.90
  } | null;

  adaptive_stop?: {
    target_seA: number;              // ex.: 0.002 A
    max_frames?: number;             // ex.: 20
  } | null;

  units?: {
    concentration?: string;          // 'mol/L', 'mg/L', etc.
    pathlength_mm?: number;          // 10 mm
    molar_mass?: number;             // p/ conversões mg/L ↔ mol/L
  };
};

export type CurveRange = { cmin: number; cmax: number }; 

export type Curve = {
  m: number; b: number;
  R2?: number; SEE?: number; s_m?: number; s_b?: number;
  LOD?: number; LOQ?: number;
  // ATENÇÃO: use sempre { cmin, cmax }. Se em algum lugar vier { Cmin, Cmax },
  range?: CurveRange;
};

export type Acquisition = {
  darkNoise?: Matrix;           
  whiteNoise?: Matrix;          
  ref1?: Matrix;                

  standards?: Array<{
    C: number;
    darkNoise?: Matrix;
    whiteNoise?: Matrix;       
    ref?: Matrix;
    sample?: Matrix;
  }>;
  sample?: Matrix;              
  ref2?: Matrix;                
};

export type QuantResults = {
  A_mean: number; A_sd: number; CV: number;
  C: number;
  CI95?: { low: number; high: number };
  QA: { saturation: boolean; outliers: number; in_range: boolean; drift: boolean; notes?: string[] };
  calib?: Curve;
};
