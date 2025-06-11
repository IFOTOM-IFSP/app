// src/components/modulesPage/interactive/ComplementaryColorPicker.tsx

import { InteractiveCard } from "@/components/InteractiveCard";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const theme = Colors.light;

export interface ColorInfo {
  name: string;
  swatchColor: string;
  perceivedName: string;
  perceivedHex: string;
}

const getContrastColor = (hex: string): string => {
  if (!hex || hex.length < 7) return "#000000";
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const ColorSwatch: React.FC<{
  color: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ color, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.colorSwatch,
      { backgroundColor: color },
      isSelected && styles.selectedSwatch,
    ]}
  />
);

interface ComplementaryColorPickerProps {
  title: string;
  description: string;
  options: ColorInfo[];
}

export const ComplementaryColorPicker: React.FC<
  ComplementaryColorPickerProps
> = ({ title, description, options }) => {
  const [selected, setSelected] = useState<ColorInfo | null>(null);

  // A lógica agora é direta, sem adivinhações.
  // Pega o código hexadecimal da cor percebida diretamente do objeto selecionado.
  const perceivedColorHex = selected?.perceivedHex ?? "#FFFFFF";
  const textColor = getContrastColor(perceivedColorHex);

  return (
    <InteractiveCard title={title} description={description}>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <ColorSwatch
            key={option.name}
            color={option.swatchColor} // Usa a cor da amostra
            isSelected={selected?.name === option.name}
            onPress={() => setSelected(option)}
          />
        ))}
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>
          Cor Absorvida:{" "}
          <Text style={styles.bold}>{selected?.name ?? "Nenhuma"}</Text>
        </Text>
        <View
          style={[
            styles.perceivedColorBox,
            { backgroundColor: perceivedColorHex }, // Usa a cor complementar correta
          ]}>
          <Text style={[styles.perceivedColorText, { color: textColor }]}>
            Cor Percebida: {selected?.perceivedName ?? ""}
          </Text>
        </View>
      </View>
    </InteractiveCard>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.background,
  },
  selectedSwatch: {
    borderColor: theme.textPrimary,
    transform: [{ scale: 1.15 }],
  },
  resultContainer: { alignItems: "center" },
  resultLabel: { fontSize: 16, marginBottom: 10, color: theme.textSecondary },
  bold: { fontWeight: "bold", color: theme.textPrimary },
  perceivedColorBox: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  perceivedColorText: { fontSize: 16, fontWeight: "bold" },
});
