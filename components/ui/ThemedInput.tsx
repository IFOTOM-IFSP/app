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
import { ThemedText } from "./ThemedText";

export type ThemedInputProps = TextInputProps & {
  variant?: "default" | "solved" | "error";
  style?: StyleProp<ViewStyle>;
  label?: string; // Optional label prop for future use
};

export function ThemedInput({
  variant = "default",
  style,
  ...rest
}: ThemedInputProps) {
  const textColor = useThemeValue("text");
  const borderColor = useThemeValue("border");
  const placeholderColor = useThemeValue("textSecondary");

  const solvedBg = useThemeValue("card");
  const solvedColor = useThemeValue("primary");
  const solvedBorder = useThemeValue("card");
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
    <>
      {rest.label && (
        <ThemedText style={{ marginBottom: Padding.xs }}>
          {rest.label}
        </ThemedText>
      )}
      <TextInput
        style={[styles.input, variantStyles[variant], style]}
        placeholderTextColor={placeholderColor}
        {...rest}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Padding.sm,
    fontSize: FontSize.md,
    textAlign: "left",
  },
});
