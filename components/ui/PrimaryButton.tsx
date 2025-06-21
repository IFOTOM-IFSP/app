// src/components/ui/PrimaryButton.tsx

import {
  BorderRadius,
  FontSize,
  FontWeight,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface PrimaryButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  activeOpacity?: number;
  variant?: "filled" | "outline";
}

export function PrimaryButton({
  onPress,
  title,
  style,
  textStyle,
  disabled = false,
  loading = false,
  activeOpacity = 0.7,
  variant = "filled",
}: PrimaryButtonProps) {
  const tintColor = useThemeValue("tint");
  const buttonTextColor = useThemeValue("buttonText");
  const disabledColor = useThemeValue("gray");

  const isOutline = variant === "outline";

  const containerStyle = [
    styles.button,
    isOutline
      ? { ...styles.outlineButton, borderColor: tintColor }
      : { backgroundColor: tintColor },
    disabled || loading
      ? {
          backgroundColor: disabledColor,
          borderColor: isOutline ? disabledColor : undefined,
        }
      : null,
    style,
  ];

  const contentTextStyle = [
    styles.buttonText,
    isOutline ? { color: tintColor } : { color: buttonTextColor },
    (disabled || loading) && isOutline ? { color: disabledColor } : null, 
    textStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}>
      {loading ? (
        <ActivityIndicator color={isOutline ? tintColor : buttonTextColor} />
      ) : (
        <Text style={contentTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: Padding.md,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    textAlign: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
  },
});
