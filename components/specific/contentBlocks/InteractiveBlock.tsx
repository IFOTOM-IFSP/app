import { AbsorcaoEmissaoTable } from "@/components/specific/interactive/AbsorcaoEmissaoTable";
import { BarComparison } from "@/components/specific/interactive/BarComparison";
import { Checklist } from "@/components/specific/interactive/Checklist";
import { ComplementaryColorPicker } from "@/components/specific/interactive/ComplementaryColorPicker";
import { FormulaSimulator } from "@/components/specific/interactive/FormulaSimulator";
import { ImageHighlight } from "@/components/specific/interactive/ImageHighlight";
import { ImpactoSetorialChart } from "@/components/specific/interactive/ImpactoSetorialChart";
import { InfoCards } from "@/components/specific/interactive/InfoCards";
import { LinearitySimulator } from "@/components/specific/interactive/LinearitySimulator";
import { MultiSlider } from "@/components/specific/interactive/MultiSlider";
import { SliderVisualization } from "@/components/specific/interactive/SliderVisualization";
import { SpectrumGraph } from "@/components/specific/interactive/SpectrumGraph";
import { StepFlow } from "@/components/specific/interactive/StepFlow";
import { ToggleExplanation } from "@/components/specific/interactive/ToggleExplanation";
import { ThemedText } from "@/components/ui/ThemedText";
import { BorderRadius, Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { InteractiveContent } from "@/models";
import {
  calculateAbsorbance,
  calculateBeerLambert,
} from "@/utils/formulas/absorbance";
import { calculateV1 } from "@/utils/formulas/dilution";
import { calculateMass } from "@/utils/formulas/mass";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FunctionExplorer } from "../interactive/FunctionExplorer";
import { PlotSlider } from "../interactive/PlotSlider";
type ComponentMap = { [key: string]: React.FC<any> };

const interactiveComponents: ComponentMap = {
  AbsorcaoEmissaoTable: AbsorcaoEmissaoTable,
  ImpactoSetorialChart: ImpactoSetorialChart,
  InfoCards: InfoCards,
  StepFlow: StepFlow,
  ComplementaryColorPicker: ComplementaryColorPicker,
  MultiSlider: MultiSlider,
  FormulaSimulator: FormulaSimulator,
  BarComparison: BarComparison,
  SpectrumGraph: SpectrumGraph,
  ToggleExplanation: ToggleExplanation,
  ImageHighlight: ImageHighlight,
  Checklist: Checklist,
  LinearitySimulator: LinearitySimulator,
  SliderVisualization: SliderVisualization,
  FunctionExplorer: FunctionExplorer,

  PlotSlider: PlotSlider,
};

export function InteractiveBlock({ block }: { block: InteractiveContent }) {
  const { componentName, props = {} } = block;
  const ComponentToRender = interactiveComponents[componentName];
  const dangerBg = useThemeValue("dangerBackground");
  const dangerText = useThemeValue("dangerText");

  if (!ComponentToRender) {
    return (
      <View
        style={[
          styles.errorPlaceholder,
          { backgroundColor: dangerBg, borderColor: dangerText },
        ]}>
        <ThemedText style={[styles.errorText, { color: dangerText }]}>
          Erro: Componente interativo {componentName} não encontrado.
        </ThemedText>
      </View>
    );
  }

  const processedProps = { ...props };
  const formulaString = props.formula || props.outputFormula;

  if (formulaString) {
    let calculateFunc: Function | null = null;

    switch (formulaString) {
      case "A = -log(T / 100)":
        calculateFunc = calculateAbsorbance;
        break;
      case "A = ε * l * c":
        calculateFunc =
          componentName === "MultiSlider"
            ? calculateBeerLambert
            : (values: Record<string, number | null>) => {
                const { A, ε, l } = values;
                if (A == null || ε == null || l == null)
                  return { error: "Valores insuf." };
                if (ε === 0 || l === 0) return { error: "Divisão por 0" };
                return { value: A / (ε * l) };
              };
        break;
      case "C1*V1 = C2*V2":
        calculateFunc = calculateV1;
        break;
      case "massa = M * V * MM":
        calculateFunc = calculateMass;
        break;
    }

    if (!calculateFunc && formulaString.includes("*")) {
      const factor = parseFloat(formulaString.split("*")[0].trim());
      if (!isNaN(factor)) {
        calculateFunc = (x: number) => factor * x;
      }
    }

    processedProps.calculate =
      calculateFunc || (() => ({ error: "Fórmula inválida" }));
  }

  return <ComponentToRender {...processedProps} />;
}
const styles = StyleSheet.create({
  errorPlaceholder: {
    borderWidth: 1,
    padding: Padding.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Margin.sm,
  },
  errorText: {
    textAlign: "center",
  },
});
