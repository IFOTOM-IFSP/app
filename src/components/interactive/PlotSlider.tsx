import { FunctionExplorer } from "@/src/components/interactive/FunctionExplorer";
import React from "react";

interface PlotSliderProps {
  title: string;
  description?: string;
  xLabel: string;
  yLabel: string;
  domain: [number, number];
  step?: number;
  calculate: (x: number) => number;
}

export const PlotSlider: React.FC<PlotSliderProps> = ({
  title,
  description,
  xLabel,
  yLabel,
  domain,
  step = 0.01,
  calculate,
}) => {
  return (
    <FunctionExplorer
      title={title}
      description={description}
      input={{
        label: xLabel,
        min: domain[0],
        max: domain[1],
        step: step,
      }}
      output={{
        label: yLabel,
        calculate: calculate,
      }}
      chartOptions={{
        xLabel: xLabel,
        yLabel: yLabel,
        domain: domain,
      }}
    />
  );
};
