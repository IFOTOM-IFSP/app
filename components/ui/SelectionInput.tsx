// Localização: src/components/ui/SelectionInput.tsx

import { ThemedText } from "@/components/ui/ThemedText";
import { BorderRadius, FontSize, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface Option {
  label: string;
  value: any;
}

interface SelectionInputProps {
  label: string;
  options: Option[];
  selectedValue: any;
  onSelect: (value: any) => void;
}

export function SelectionInput({
  label,
  options,
  selectedValue,
  onSelect,
}: SelectionInputProps) {
  const borderColor = useThemeValue("border");
  const textColor = useThemeValue("text");
  const secondaryTextColor = useThemeValue("textSecondary");

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "Selecione...";

  const showOptions = () => {
    Alert.alert(
      label, 
      "Escolha uma das opções abaixo:", 
      [
        // Mapeia as opções para os botões do alerta
        ...options.map((option) => ({
          text: option.label,
          onPress: () => onSelect(option.value),
        })),
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.label, { color: secondaryTextColor }]}>
        {label}
      </ThemedText>
      <TouchableOpacity
        style={[styles.button, { borderColor }]}
        onPress={showOptions}
        accessibilityLabel={label}
        accessibilityValue={{ text: selectedLabel }}>
        <ThemedText style={[styles.buttonText, { color: textColor }]}>
          {selectedLabel}
        </ThemedText>
        <Feather name="chevron-down" size={20} color={secondaryTextColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Padding.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "500",
    marginBottom: Padding.sm,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Padding.md,
  },
  buttonText: {
    fontSize: FontSize.md,
  },
});
