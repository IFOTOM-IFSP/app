export interface SpectrometerProfile {
  id: string; 
  name: string;
  calibrationDate: string; 
  pixelToWavelengthMapping: {
    type: 'polynomial';
    coefficients: number[]; // lei de lambert-beer
  };
}