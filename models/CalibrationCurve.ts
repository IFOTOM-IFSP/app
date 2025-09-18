export interface CalibrationCurve {
  id: string;
  substanceName: string;
  wavelengthNm: number;
  creationDate: string;
  coefficients: {
    slope_m: number;
    intercept_b: number;
    r_squared: number;
  };
}