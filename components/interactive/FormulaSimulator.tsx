import { InteractiveCard } from "@/components/InteractiveCard";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const theme = Colors.light;

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

  return (
    <InteractiveCard title={title} description={description}>
      <Text style={styles.formula}>{formula.replace(/\*/g, " · ")}</Text>

      {variables.map((variable) => {
        const isResultField = variable.solveFor;
        const hasError = isResultField && result.error;

        return (
          <View key={variable.symbol} style={styles.inputRow}>
            <Text style={styles.label}>{variable.label}:</Text>
            <TextInput
              style={[
                styles.input,
                isResultField && styles.solvedInput,
                hasError && styles.errorInput,
              ]}
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
              placeholderTextColor={theme.textSecondary}
            />
            <Text style={styles.unit}>{variable.unit}</Text>
          </View>
        );
      })}
    </InteractiveCard>
  );
};

const styles = StyleSheet.create({
  formula: {
    fontSize: 22,
    fontFamily: "monospace",
    color: theme.textPrimary,
    marginBottom: 24,
    textAlign: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  label: { flex: 2.5, fontSize: 16, color: theme.textPrimary },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: theme.textPrimary,
    textAlign: "right",
  },
  solvedInput: {
    backgroundColor: "rgba(107, 70, 193, 0.05)",
    color: theme.accentPurple,
    fontWeight: "bold",
    borderColor: "rgba(107, 70, 193, 0.2)",
  },
  errorInput: { borderColor: theme.pink, color: theme.pink },
  unit: { flex: 1.5, fontSize: 14, color: theme.textSecondary, marginLeft: 8 },
});
