import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { type TextProps, Text } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedTextProps) {
  const color = useThemeValue("text");

  return <Text style={[{ color }, style]} {...rest} />;
}
