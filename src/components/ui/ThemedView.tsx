import { useThemeValue } from "@/src/hooks/useThemeValue";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...rest }: ThemedViewProps) {
  const backgroundColor = useThemeValue("background");

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
