export const convertWavelengthToWavenumber = (wavelengthNm?: number): number | null => {
  if (wavelengthNm === undefined || wavelengthNm <= 0) return null;
  return 1 / (wavelengthNm * 1e-7); // 1e7 / wavelengthNm
};

export const convertWavenumberToWavelength = (wavenumber?: number): number | null => {
  if (wavenumber === undefined || wavenumber <= 0) return null;
  return 1e7 / wavenumber;
};
