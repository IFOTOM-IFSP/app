import { BorderRadius, FontSize, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";

type ThemedInputProps = TextInputProps & {
  variant?: "default" | "solved" | "error";
  style?: StyleProp<ViewStyle>;
};

export function ThemedInput({
  variant = "default",
  style,
  ...rest
}: ThemedInputProps) {
  const textColor = useThemeValue("textPrimary");
  const borderColor = useThemeValue("borderColor");
  const placeholderColor = useThemeValue("textSecondary");

  const solvedBg = useThemeValue("solvedInputBackground");
  const solvedColor = useThemeValue("accentPurple");
  const solvedBorder = useThemeValue("solvedInputBorder");
  const errorColor = useThemeValue("dangerBackground");

  const variantStyles = {
    default: {
      borderColor: borderColor,
      color: textColor,
    },
    solved: {
      backgroundColor: solvedBg,
      color: solvedColor,
      borderColor: solvedBorder,
      fontWeight: "bold",
    },
    error: {
      borderColor: errorColor,
      color: errorColor,
    },
  };

  return (
    <TextInput
      style={[styles.input, variantStyles[variant], style]}
      placeholderTextColor={placeholderColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Padding.sm,
    fontSize: FontSize.md,
    textAlign: "right",
  },
});
