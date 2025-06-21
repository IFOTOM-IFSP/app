export const convertNmToUm = (nm?: number): number | null => {
  if (nm === undefined) return null;
  return nm / 1000;
};

export const convertUmToNm = (um?: number): number | null => {
  if (um === undefined) return null;
  return um * 1000;
};
