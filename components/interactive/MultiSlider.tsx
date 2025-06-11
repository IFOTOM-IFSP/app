import { InteractiveCard } from "@/components/InteractiveCard";
import { Colors } from "@/constants/Colors";
import Slider from "@react-native-community/slider";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

type InputConfig = {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  default: number;
};

type SliderValues = Record<string, number>;

type MultiSliderProps = {
  title: string;
  description: string;
  inputs: InputConfig[];
  outputLabel: string;
  calculate: (values: SliderValues) => number;
};

export const MultiSlider: React.FC<MultiSliderProps> = ({
  title,
  description,
  inputs,
  outputLabel,
  calculate,
}) => {
  const initialState = useMemo(() => {
    return inputs.reduce((acc, input) => {
      acc[input.id] = input.default;
      return acc;
    }, {} as SliderValues);
  }, [inputs]);

  const [values, setValues] = useState(initialState);

  const handleValueChange = (id: string, newValue: number) => {
    setValues((prev) => ({ ...prev, [id]: newValue }));
  };

  const outputValue = calculate(values);

  return (
    <InteractiveCard title={title} description={description}>
      <View style={styles.controlsContainer}>
        {inputs.map((input) => (
          <View key={input.id} style={styles.controlBlock}>
            <Text style={styles.label}>
              {input.label}:{" "}
              <Text style={styles.valueText}>
                {values[input.id].toFixed(3)}
              </Text>
            </Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={input.min}
              maximumValue={input.max}
              step={input.step || 1}
              value={values[input.id]}
              onValueChange={(newValue) =>
                handleValueChange(input.id, newValue)
              }
              minimumTrackTintColor={theme.accentPurple}
              maximumTrackTintColor={theme.borderColor}
              thumbTintColor={theme.accentPurple}
            />
          </View>
        ))}
      </View>
      <View style={styles.output}>
        <Text style={styles.label}>{outputLabel}:</Text>
        <Text style={styles.outputValue}>{outputValue.toFixed(4)}</Text>
      </View>
    </InteractiveCard>
  );
};

const styles = StyleSheet.create({
  controlsContainer: { marginBottom: 16 },
  controlBlock: { marginBottom: 8 },
  label: { fontSize: 16, color: theme.textSecondary, marginBottom: 4 },
  valueText: { fontWeight: "bold", color: theme.textPrimary },
  output: {
    backgroundColor: "rgba(107, 70, 193, 0.05)",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  outputValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.accentPurple,
    marginTop: 4,
  },
});
