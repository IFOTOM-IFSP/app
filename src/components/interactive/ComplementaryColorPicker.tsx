import { InteractiveCard } from "@/src/components/common/InteractiveCard";
import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { getContrastColor } from "@/utils/colorUtils";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface ColorInfo {
  name: string;
  swatchColor: string;
  perceivedName: string;
  perceivedHex: string;
}

interface ComplementaryColorPickerProps {
  title: string;
  description: string;
  options: ColorInfo[];
}

const ColorSwatch: React.FC<{
  color: string;
  isSelected: boolean;
  onPress: () => void;
  borderColor: string;
}> = ({ color, isSelected, onPress, borderColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.colorSwatch,
      {
        backgroundColor: color,
        borderColor: isSelected ? borderColor : "transparent",
      },
    ]}
  />
);

export function ComplementaryColorPicker({
  title,
  description,
  options,
}: ComplementaryColorPickerProps) {
  const themeText = useThemeValue("text");
  const themeTextSecondary = useThemeValue("textSecondary");
  const themeButtonText = useThemeValue("buttonText");
  const themeBorder = useThemeValue("border");
  const themeBackground = useThemeValue("background");

  const [selected, setSelected] = useState<ColorInfo | null>(null);

  const perceivedColorHex = selected?.perceivedHex ?? themeBackground;
  const textColor = getContrastColor(
    perceivedColorHex,
    themeText,
    themeButtonText
  );

  return (
    <InteractiveCard title={title} description={description}>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <ColorSwatch
            key={option.name}
            color={option.swatchColor}
            isSelected={selected?.name === option.name}
            onPress={() => setSelected(option)}
            borderColor={themeText}
          />
        ))}
      </View>

      <View style={styles.resultContainer}>
        <ThemedText style={[styles.resultLabel, { color: themeTextSecondary }]}>
          Cor Absorvida:{" "}
          <ThemedText style={[styles.bold, { color: themeText }]}>
            {selected?.name ?? "Nenhuma"}
          </ThemedText>
        </ThemedText>
        <View
          style={[
            styles.perceivedColorBox,
            { backgroundColor: perceivedColorHex, borderColor: themeBorder },
          ]}>
          <ThemedText style={[styles.perceivedColorText, { color: textColor }]}>
            Cor Percebida: {selected?.perceivedName ?? ""}
          </ThemedText>
        </View>
      </View>
    </InteractiveCard>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: Margin.xl,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  resultContainer: {
    alignItems: "center",
  },
  resultLabel: {
    fontSize: FontSize.md,
    marginBottom: Margin.sm,
  },
  bold: {
    fontWeight: FontWeight.bold,
  },
  perceivedColorBox: {
    width: "100%",
    height: 80,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  perceivedColorText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
