import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { StyleSheet, TextInputProps, View } from "react-native";

interface UnitInputProps extends TextInputProps {
  label: string;
  unit: string;
}

export function UnitInput({ label, unit, ...props }: UnitInputProps) {
  const secondaryText = useThemeValue("textSecondary");
  const borderColor = useThemeValue("border");

  return (
    <View style={unitInputStyles.inputContainer}>
      <ThemedText
        style={[unitInputStyles.inputLabel, { color: secondaryText }]}>
        {label}
      </ThemedText>
      <View style={[unitInputStyles.inputWrapper, { borderColor }]}>
        <ThemedInput
          style={unitInputStyles.inputField}
          keyboardType="numeric"
          {...props}
        />
        <ThemedText
          style={[unitInputStyles.inputUnit, { color: secondaryText }]}>
          {unit}
        </ThemedText>
      </View>
    </View>
  );
}

const unitInputStyles = StyleSheet.create({
  inputContainer: {
    marginBottom: Margin.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Margin.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
  },
  inputField: {
    flex: 1,
    padding: Padding.md,
    fontSize: FontSize.md,
    borderWidth: 0,
    textAlign: "left",
  },
  inputUnit: {
    paddingHorizontal: Padding.md,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
