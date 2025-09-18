import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...rest }: ThemedViewProps) {
  const backgroundColor = useThemeValue("background");

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
