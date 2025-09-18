import { ThemedText } from "@/src/components/ui/ThemedText";
import { BorderRadius, FontSize, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "./icon/Icon";

interface Option<T> {
  label: string;
  value: T;
}

interface SelectionInputProps<T> {
  label: string;
  options: Option<T>[];
  selectedValue: T | undefined; 
  onSelect: (value: T) => void;
  placeholder?: string;
}

export function SelectionInput<T>({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "Selecione...",
}: SelectionInputProps<T>) {
  const borderColor = useThemeValue("border");
  const textColor = useThemeValue("text");
  const secondaryTextColor = useThemeValue("textSecondary");

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  const showOptions = () => {
    Alert.alert(
      label,
      "Escolha uma das opções abaixo:",
      [
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
        <Icon
          library="Feather"
          name="chevron-down"
          size={20}
          color={secondaryTextColor}
        />
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
