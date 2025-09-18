import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type Status = "default" | "correct" | "incorrect";

interface QuizOptionProps {
  text: string;
  status: Status;
  onPress: () => void;
  disabled: boolean;
}

export function QuizOption({
  text,
  status,
  onPress,
  disabled,
}: QuizOptionProps) {
  const defaultBg = useThemeValue("card");
  const defaultBorder = useThemeValue("border");
  const defaultText = useThemeValue("text");

  const correctBg = useThemeValue("successBackground");
  const correctBorder = useThemeValue("green");
  const correctText = useThemeValue("successText");

  const incorrectBg = useThemeValue("dangerBackground");
  const incorrectBorder = useThemeValue("danger");
  const incorrectText = useThemeValue("dangerText");

  const statusStyles = {
    default: { backgroundColor: defaultBg, borderColor: defaultBorder },
    correct: { backgroundColor: correctBg, borderColor: correctBorder },
    incorrect: { backgroundColor: incorrectBg, borderColor: incorrectBorder },
  };

  const statusTextStyles = {
    default: { color: defaultText },
    correct: { color: correctText, fontWeight: FontWeight.bold },
    incorrect: { color: incorrectText, fontWeight: FontWeight.bold },
  };

  return (
    <TouchableOpacity
      style={[styles.optionButton, statusStyles[status]]}
      onPress={onPress}
      disabled={disabled}>
      <ThemedText style={[styles.optionText, statusTextStyles[status]]}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: Margin.sm,
  },
  optionText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
  },
});
