// src/components/charts/SpectrumPlot.tsx

import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "@/lib/victoryCompat";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useMemo } from "react";
import { View } from "react-native";

type Spectrum = {
  lambda: number[];
  I_dark?: number[];
  I_white_noise?: number[];
  I_ref?: number[];
  I_sample?: number[];
  window_nm?: number;
};

export default function SpectrumPlot({
  spectrum,
  lambda_nm,
  window_nm = 4,
  height = 260,
}: {
  spectrum?: Spectrum;
  lambda_nm: number;
  window_nm?: number;
  height?: number;
}) {
  if (!spectrum?.lambda?.length) return null;

  const { bandData, maxY, series } = useMemo(() => {
    const L = spectrum.lambda;
    const toXY = (ys?: number[]) => (ys ?? []).map((y, i) => ({ x: L[i], y }));

    const s = {
      dark: toXY(spectrum.I_dark),
      white: toXY(spectrum.I_white_noise),
      ref: toXY(spectrum.I_ref),
      sample: toXY(spectrum.I_sample),
    };

    // y máximo para pintar faixa
    const maxY = Math.max(
      1,
      ...[s.dark, s.white, s.ref, s.sample].flat().map((p) => p?.y ?? 0)
    );

    // sombreamento [λ-Δ/2, λ+Δ/2]
    const low = lambda_nm - window_nm / 2;
    const high = lambda_nm + window_nm / 2;
    const bandData = L.map((x) => ({ x, y: x >= low && x <= high ? maxY : 0 }));

    return { bandData, maxY, series: s };
  }, [spectrum, lambda_nm, window_nm]);

  return (
    <View style={{ marginTop: 12 }}>
      <ThemedText style={{ fontWeight: "700", marginBottom: 6 }}>
        Espectro (I × λ)
      </ThemedText>
      <VictoryChart
        height={height}
        theme={VictoryTheme.material}
        padding={{ top: 16, left: 50, right: 20, bottom: 40 }}>
        {/* janela sombreada */}
        <VictoryArea
          data={bandData}
          interpolation="linear"
          style={{ data: { fillOpacity: 0.15 } }}
        />
        <VictoryAxis label="λ (nm)" style={{ axisLabel: { padding: 32 } }} />
        <VictoryAxis
          dependentAxis
          label="Intensidade"
          style={{ axisLabel: { padding: 40 } }}
        />

        {/* traços */}
        {series.dark?.length ? <VictoryLine data={series.dark} /> : null}
        {series.white?.length ? <VictoryLine data={series.white} /> : null}
        {series.ref?.length ? <VictoryLine data={series.ref} /> : null}
        {series.sample?.length ? <VictoryLine data={series.sample} /> : null}
      </VictoryChart>
    </View>
  );
}
