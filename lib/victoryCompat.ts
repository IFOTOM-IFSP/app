// src/lib/victoryCompat.ts
let V: any;
try {
  // runtime import — funciona mesmo se os .d.ts estiverem desatualizados
  V = require('victory-native');
} catch (e) {
  V = {};
  console.warn('[victoryCompat] victory-native não encontrado:', e);
}

// stubs seguros (app não quebra caso falte algo; só não desenha o gráfico)
const Stub = ({ children }: any) => children ?? null;

export const VictoryChart   = V.VictoryChart   ?? Stub;
export const VictoryAxis    = V.VictoryAxis    ?? Stub;
export const VictoryLine    = V.VictoryLine    ?? Stub;
export const VictoryScatter = V.VictoryScatter ?? Stub;
export const VictoryArea    = V.VictoryArea    ?? Stub;
export const VictoryTheme   = V.VictoryTheme   ?? { material: {} };
