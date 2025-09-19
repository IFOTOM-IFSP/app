export function meanVector(frames: number[][]): number[] {
  if (!frames.length) return [];
  const n = frames.length, m = frames[0].length;
  const out = new Array(m).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) out[j] += frames[i][j];
  for (let j = 0; j < m; j++) out[j] /= n;
  return out;
}

export function argMax(a: number[], window = 5): number {
  const n = a.length, s = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let acc = 0, c = 0;
    for (let k = -window; k <= window; k++) {
      const idx = i + k;
      if (idx >= 0 && idx < n) { acc += a[idx]; c++; }
    }
    s[i] = acc / c;
  }
  let imax = 0, vmax = -Infinity;
  for (let i = 0; i < n; i++) if (s[i] > vmax) { vmax = s[i]; imax = i; }
  return imax;
}

export type FitResult = { a0: number; a1: number; a2?: number; rmse: number };

export function polyfitPxToNm(points: { px: number; nm: number }[]): FitResult {
  if (points.length < 2) throw new Error('Ao menos 2 pontos necessários');
  if (points.length === 2) {
    const [p1, p2] = points;
    const a1 = (p2.nm - p1.nm) / (p2.px - p1.px);
    const a0 = p1.nm - a1 * p1.px;
    const rmse = Math.sqrt(((p1.nm - (a0 + a1 * p1.px)) ** 2 + (p2.nm - (a0 + a1 * p2.px)) ** 2) / 2);
    return { a0, a1, rmse };
  }
  // quadrático (3 pontos)
  const [p1, p2, p3] = points;
  // sistema 3x3
  const X = [
    [1, p1.px, p1.px*p1.px],
    [1, p2.px, p2.px*p2.px],
    [1, p3.px, p3.px*p3.px],
  ];
  const y = [p1.nm, p2.nm, p3.nm];
  function solve3(A: number[][], b: number[]): number[] {
    const M = A.map((r,i)=>[...r, b[i]]);
    for (let i=0;i<3;i++){
      let piv=i; for (let r=i+1;r<3;r++) if (Math.abs(M[r][i])>Math.abs(M[piv][i])) piv=r;
      if (piv!==i) [M[i],M[piv]]=[M[piv],M[i]];
      const d = M[i][i] || 1e-12; for (let c=i;c<4;c++) M[i][c]/=d;
      for (let r=0;r<3;r++){ if(r===i) continue; const f=M[r][i]; for(let c=i;c<4;c++) M[r][c]-=f*M[i][c]; }
    }
    return [M[0][3], M[1][3], M[2][3]];
  }
  const [a0,a1,a2] = solve3(X, y);
  const est = (px:number) => a0 + a1*px + a2*px*px;
  const rmse = Math.sqrt(((y[0]-est(p1.px))**2 + (y[1]-est(p2.px))**2 + (y[2]-est(p3.px))**2)/3);
  return { a0, a1, a2, rmse };
}
