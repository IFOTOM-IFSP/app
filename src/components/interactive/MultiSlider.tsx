import { InteractiveCard } from "@/src/components/common/InteractiveCard";
import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import Slider from "@react-native-community/slider";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

export interface InputConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  default: number;
}
type SliderValues = Record<string, number>;
type CalculationResult = number;
interface MultiSliderProps {
  title: string;
  description: string;
  inputs: InputConfig[];
  outputLabel: string;
  calculate: (values: SliderValues) => CalculationResult;
}

export function MultiSlider({
  title,
  description,
  inputs,
  outputLabel,
  calculate,
}: MultiSliderProps) {
  const initialState = useMemo(() => {
    return inputs.reduce((acc, input) => {
      acc[input.id] = input.default;
      return acc;
    }, {} as SliderValues);
  }, [inputs]);

  const [values, setValues] = useState(initialState);

  const textPrimary = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");
  const borderColor = useThemeValue("border");
  const outputBg = useThemeValue("card");

  const handleValueChange = (id: string, newValue: number) => {
    setValues((prev) => ({ ...prev, [id]: newValue }));
  };

  const outputValue = calculate(values);

  return (
    <InteractiveCard title={title} description={description}>
      <View style={styles.controlsContainer}>
        {inputs.map((input) => (
          <View key={input.id} style={styles.controlBlock}>
            <ThemedText style={[styles.label, { color: textSecondary }]}>
              {input.label}:{" "}
              <ThemedText style={[styles.valueText, { color: textPrimary }]}>
                {values[input.id].toFixed(3)}
              </ThemedText>
            </ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={input.min}
              maximumValue={input.max}
              step={input.step || 1}
              value={values[input.id]}
              onValueChange={(newValue) =>
                handleValueChange(input.id, newValue)
              }
              minimumTrackTintColor={accentColor}
              maximumTrackTintColor={borderColor}
              thumbTintColor={accentColor}
            />
          </View>
        ))}
      </View>
      <View style={[styles.output, { backgroundColor: outputBg }]}>
        <ThemedText style={[styles.label, { color: textSecondary }]}>
          {outputLabel}:
        </ThemedText>
        <ThemedText style={[styles.outputValue, { color: accentColor }]}>
          {outputValue.toFixed(4)}
        </ThemedText>
      </View>
    </InteractiveCard>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    marginBottom: Margin.md,
  },
  controlBlock: {
    marginBottom: Margin.sm,
  },
  label: {
    fontSize: FontSize.md,
    marginBottom: Margin.xs,
  },
  valueText: {
    fontWeight: FontWeight.bold,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  output: {
    borderRadius: BorderRadius.md,
    padding: Padding.md,
    alignItems: "center",
    justifyContent: "center",
  },
  outputValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginTop: Margin.xs,
  },
});
