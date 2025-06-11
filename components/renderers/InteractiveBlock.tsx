import AbsorcaoEmissaoTable from "@/components/interactive/AbsorcaoEmissaoTable";
import { BarComparison } from "@/components/interactive/BarComparison";
import { Checklist } from "@/components/interactive/Checklist";
import { ComplementaryColorPicker } from "@/components/interactive/ComplementaryColorPicker";
import { FormulaSimulator } from "@/components/interactive/FormulaSimulator";
import ImageHighlight from "@/components/interactive/ImageHighlight";
import ImpactoSetorialChart from "@/components/interactive/ImpactoSetorialChart";
import { InfoCards } from "@/components/interactive/InfoCards";
import { LinearitySimulator } from "@/components/interactive/LinearitySimulator";
import { MultiSlider } from "@/components/interactive/MultiSlider";
import { SliderVisualization } from "@/components/interactive/SliderVisualization";
import { SpectrumGraph } from "@/components/interactive/SpectrumGraph";
import { StepFlow } from "@/components/interactive/StepFlow";
import { ToggleExplanation } from "@/components/interactive/ToggleExplanation";
import { InteractiveContent } from "@/interfaces/content";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FunctionExplorer } from "../FunctionExplorer";
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

export const InteractiveBlock: React.FC<{ block: InteractiveContent }> = ({
  block,
}) => {
  // Garante que 'props' seja sempre um objeto, evitando erros com 'undefined'.
  const { componentName, props = {} } = block;
  const ComponentToRender = interactiveComponents[componentName];

  if (!ComponentToRender) {
    return (
      <View style={styles.errorPlaceholder}>
        <Text style={styles.errorText}>
          Erro: Componente interativo {componentName} não foi encontrado ou não
          está registado.
        </Text>
      </View>
    );
  }

  // Cria uma cópia das props para podermos modificá-las com segurança.
  const processedProps = { ...props };

  // --- LÓGICA DE TRADUÇÃO CENTRALIZADA E COMPLETA ---

  // Bloco 1: Lida com componentes de slider único (PlotSlider, SliderVisualization)
  if (
    componentName === "PlotSlider" ||
    componentName === "SliderVisualization"
  ) {
    const formulaString = props.formula || props.outputFormula;
    if (formulaString) {
      if (formulaString === "A = -log(T / 100)") {
        processedProps.calculate = (value: number) => -Math.log10(value / 100);
      } else if (formulaString.includes("*")) {
        const factor = parseFloat(formulaString.split("*")[0]);
        if (!isNaN(factor)) {
          processedProps.calculate = (x: number) => factor * x;
        }
      }
      // Limpa as props de fórmula em texto, pois já foram "traduzidas"
      delete processedProps.formula;
      delete processedProps.outputFormula;
    }
  }

  // Bloco 2: Lida com o MultiSlider
  else if (componentName === "MultiSlider") {
    if (props.outputFormula === "A = ε * l * c") {
      processedProps.calculate = (values: Record<string, number>) => {
        if (values.epsilon != null && values.l != null && values.c != null) {
          return values.epsilon * values.l * values.c;
        }
        return 0; // Retorno seguro
      };
      delete processedProps.outputFormula;
    }
  }

  // Bloco 3: Lida com o FormulaSimulator
  else if (componentName === "FormulaSimulator") {
    if (props.formula) {
      let calculateFunc:
        | ((values: Record<string, number | null>) => object)
        | null = null;
      switch (props.formula) {
        case "C1*V1 = C2*V2":
          calculateFunc = (values) => {
            const { C1, V1, C2, V2 } = values;
            if (C1 == null || C2 == null || V2 == null)
              return { error: "Valores insuf." };
            if (C1 === 0) return { error: "Divisão por 0" };
            return { value: (C2 * V2) / C1 };
          };
          break;
        case "massa = M * V * MM":
          calculateFunc = (values) => {
            const { M, V, MM } = values;
            if (M == null || V == null || MM == null)
              return { error: "Valores insuf." };
            return { value: M * V * MM };
          };
          break;
        case "A = ε * l * c":
          calculateFunc = (values) => {
            const { A, ε, l } = values;
            if (A == null || ε == null || l == null)
              return { error: "Valores insuf." };
            if (ε === 0 || l === 0) return { error: "Divisão por 0" };
            return { value: A / (ε * l) };
          };
          break;
      }
      // Garante que 'calculate' é sempre uma função para evitar o crash
      processedProps.calculate =
        calculateFunc || (() => ({ error: "Fórmula inválida" }));
      // A prop 'formula' NÃO é removida aqui, pois o componente precisa dela para exibição.
    }
  }

  // Renderiza o componente correto com as props já processadas e corrigidas.
  return <ComponentToRender {...processedProps} />;
};

const styles = StyleSheet.create({
  errorPlaceholder: {
    backgroundColor: "rgba(255, 99, 132, 0.1)",
    borderColor: "rgba(255, 99, 132, 1)",
    borderWidth: 1,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  errorText: {
    color: "rgba(255, 99, 132, 1)",
  },
  placeholder: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
});
