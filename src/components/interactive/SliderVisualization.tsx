import {
  FunctionExplorer,
  FunctionExplorerProps,
} from "@/components/interactive/FunctionExplorer";
import React from "react";

type SliderVisualizationProps = Omit<
  FunctionExplorerProps,
  "chartOptions" | "output"
> & {
  outputLabel: string;
  calculate: (value: number) => number;
};

export const SliderVisualization: React.FC<SliderVisualizationProps> = ({
  title,
  description,
  input,
  outputLabel,
  calculate,
}) => {
  return (
    <FunctionExplorer
      title={title}
      description={description}
      input={input}
      output={{
        label: outputLabel,
        calculate: calculate,
      }}
    />
  );
};
