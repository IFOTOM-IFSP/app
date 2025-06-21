import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import  React  from "react";
import { StyleSheet, TextInputProps, View } from "react-native";

interface UnitInputProps extends TextInputProps {
  label: string;
  unit: string;
}

export function UnitInput({ label, unit, ...props }: UnitInputProps) {
  const secondaryText = useThemeValue("textSecondary");
  const borderColor = useThemeValue("borderColor");

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

// --- ESTILOS CORRIGIDOS PARA O UnitInput ---
const unitInputStyles = StyleSheet.create({
  inputContainer: {
    marginBottom: Margin.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: Margin.sm,
    // O alinhamento à esquerda já é o padrão para ThemedText
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center", // Alinha os itens (input e unidade) verticalmente no centro
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
  },
  inputField: {
    flex: 1,
    padding: Padding.md,
    fontSize: FontSize.md,
    borderWidth: 0,
    textAlign: "left", // Força o texto do input a alinhar à esquerda
  },
  inputUnit: {
    paddingHorizontal: Padding.md,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
