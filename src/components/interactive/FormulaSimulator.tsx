import { InteractiveCard } from "@/src/components/common/InteractiveCard";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export interface Variable {
  symbol: string;
  label: string;
  value: number | null;
  unit: string;
  solveFor?: boolean;
}

type Values = Record<string, number | null>;

type CalculationResult = {
  value?: number;
  error?: string;
};

interface FormulaSimulatorProps {
  title: string;
  description?: string;
  formula: string;
  variables: Variable[];
  calculate: (values: Values) => CalculationResult;
}

export const FormulaSimulator: React.FC<FormulaSimulatorProps> = ({
  title,
  description,
  formula,
  variables,
  calculate,
}) => {
  const initialState = variables.reduce(
    (acc, v) => ({ ...acc, [v.symbol]: v.value }),
    {}
  );
  const [inputValues, setInputValues] = useState<Values>(initialState);
  const [result, setResult] = useState<CalculationResult>({});

  useEffect(() => {
    const calculationResult = calculate(inputValues);
    setResult(calculationResult);
  }, [inputValues, calculate]);

  const handleInputChange = (symbol: string, text: string) => {
    const cleanedText = text.replace(",", ".");
    const newValue = cleanedText.trim() === "" ? null : parseFloat(cleanedText);

    if (newValue === null || !isNaN(newValue)) {
      setInputValues((prev) => ({ ...prev, [symbol]: newValue }));
    }
  };

  const formulaBg = useThemeValue("card");
  const primaryText = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");

  return (
    <InteractiveCard title={title} description={description}>
      <ThemedText
        style={[
          styles.formula,
          { backgroundColor: formulaBg, color: primaryText },
        ]}>
        {formula.replace(/\*/g, " · ")}
      </ThemedText>

      {variables.map((variable) => {
        const isResultField = variable.solveFor;
        const hasError = isResultField && result.error;
        const variant = isResultField
          ? hasError
            ? "error"
            : "solved"
          : "default";

        return (
          <View key={variable.symbol} style={styles.inputRow}>
            <ThemedText style={[styles.label, { color: primaryText }]}>
              {variable.label}:
            </ThemedText>
            <ThemedInput
              style={styles.input}
              value={
                isResultField
                  ? hasError
                    ? result.error
                    : result.value?.toFixed(4) ?? ""
                  : inputValues[variable.symbol]?.toString() ?? ""
              }
              onChangeText={(text) => handleInputChange(variable.symbol, text)}
              keyboardType="numeric"
              editable={!isResultField}
              placeholder={isResultField ? "..." : "0"}
              variant={variant}
            />
            <ThemedText style={[styles.unit, { color: secondaryText }]}>
              {variable.unit}
            </ThemedText>
          </View>
        );
      })}
    </InteractiveCard>
  );
};

const styles = StyleSheet.create({
  formula: {
    fontSize: FontSize.xl,
    fontFamily: "monospace",
    marginBottom: Margin.lg,
    textAlign: "center",
    padding: Padding.sm,
    borderRadius: BorderRadius.md,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Margin.md,
  },
  label: {
    flex: 2.5,
    fontSize: FontSize.md,
  },
  input: {
    flex: 2,
  },
  unit: {
    flex: 1.5,
    fontSize: FontSize.sm,
    marginLeft: Margin.sm,
  },
});
