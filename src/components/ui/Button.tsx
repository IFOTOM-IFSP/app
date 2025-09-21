import {
  BorderRadius,
  FontSize,
  FontWeight,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  activeOpacity?: number;
  variant?: "filled" | "outline";
  icon?: React.ReactNode;
}

export function Button({
  onPress,
  title,
  style,
  textStyle,
  disabled = false,
  loading = false,
  activeOpacity = 0.7,
  variant = "filled",
  icon,
}: ButtonProps) {
  const tintColor = useThemeValue("primary");
  const buttonTextColor = useThemeValue("buttonText");
  const disabledBgColor = useThemeValue("disabledBackground");
  const disabledTextColor = useThemeValue("disabledText");

  const isOutline = variant === "outline";

  const containerStyle = [
    styles.button,
    isOutline
      ? { ...styles.outlineButton, borderColor: tintColor }
      : { backgroundColor: tintColor },
    disabled || loading
      ? {
          backgroundColor: disabledBgColor,
          borderColor: isOutline ? disabledBgColor : undefined,
          buttonTextColor: disabledTextColor,
        }
      : null,
    style,
  ];

  const contentTextStyle = [
    styles.buttonText,
    isOutline ? { color: tintColor } : { color: buttonTextColor },
    (disabled || loading) && isOutline ? { color: disabledBgColor } : null,
    icon ? { marginLeft: Spacing.sm } : null,
    textStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      delayPressOut={100}
      accessibilityState={{ disabled: disabled || loading }}>
      {loading ? (
        <ActivityIndicator color={isOutline ? tintColor : buttonTextColor} />
      ) : (
        <View style={styles.contentContainer}>
          {icon}
          <Text style={contentTextStyle}>{title}</Text>
        </View>
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
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
