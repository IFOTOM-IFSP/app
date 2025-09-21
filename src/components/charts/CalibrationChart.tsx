// src/components/charts/CalibrationChart.tsx
import type { CalibrationCurve } from "@/types/api";
import { useMemo } from "react";
import { View } from "react-native";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";

type StandardsPoint = { C: number; A_mean: number; A_sd?: number };

type Props = {
  calib?: CalibrationCurve;
  points?: StandardsPoint[]; // se disponível (opcional)
  sampleA?: number; // absorvância da amostra para destacar
};

export default function CalibrationChart({ calib, points, sampleA }: Props) {
  const { lineData, pts, bandData, domainX, domainY, samplePt } =
    useMemo(() => {
      const pts = (points ?? []).filter(
        (p) => Number.isFinite(p.C) && Number.isFinite(p.A_mean)
      );
      // domínio X
      const cmin =
        calib?.range?.cmin ??
        (pts.length ? Math.min(...pts.map((p) => p.C)) : 0);
      const cmax =
        calib?.range?.cmax ??
        (pts.length ? Math.max(...pts.map((p) => p.C)) : 1);
      const padX = (cmax - cmin || 1) * 0.06;
      const domainX: [number, number] = [cmin - padX, cmax + padX];
      // gerar reta A = mC + b
      const lineData = calib
        ? [
            { x: domainX[0], y: calib.m * domainX[0] + calib.b },
            { x: domainX[1], y: calib.m * domainX[1] + calib.b },
          ]
        : [];
      // domínio Y bruto a partir de pontos e linha
      const ys = [
        ...pts.map((p) => p.A_mean),
        ...lineData.map((d) => d.y),
      ].filter(Number.isFinite);
      const yMin = ys.length ? Math.min(...ys) : 0;
      const yMax = ys.length ? Math.max(...ys) : 1;
      const padY = (yMax - yMin || 1) * 0.1;
      const domainY: [number, number] = [yMin - padY, yMax + padY];
      // banda de faixa [Cmin,Cmax]
      const bandData = [
        { x: cmin, y: domainY[1], y0: domainY[0] },
        { x: cmax, y: domainY[1], y0: domainY[0] },
      ];
      // amostra: se temos A e a curva, projetar C estimado → plotar ponto
      let samplePt: { x: number; y: number } | undefined;
      if (Number.isFinite(sampleA) && calib && Math.abs(calib.m) > 1e-12) {
        const C = (sampleA! - calib.b) / calib.m;
        samplePt = { x: C, y: sampleA! };
      }
      return { lineData, pts, bandData, domainX, domainY, samplePt };
    }, [calib, points, sampleA]);

  if (!calib && !points?.length) return null;

  return (
    <View style={{ height: 240, marginTop: 12 }}>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ x: domainX, y: domainY }}>
        {/* faixa de validade da curva */}
        <VictoryArea
          data={bandData}
          style={{ data: { fill: "#34d39944", strokeWidth: 0 } }}
        />

        <VictoryAxis label="Concentração (C)" />
        <VictoryAxis dependentAxis label="Absorbância (A)" />

        {lineData.length ? <VictoryLine data={lineData} /> : null}
        {pts.length ? (
          <VictoryScatter
            size={4}
            data={pts.map((p) => ({ x: p.C, y: p.A_mean }))}
          />
        ) : null}
        {samplePt ? (
          <VictoryScatter
            size={6}
            style={{ data: { fill: "#ef4444" } }}
            data={[samplePt]}
          />
        ) : null}
      </VictoryChart>
    </View>
  );
}
