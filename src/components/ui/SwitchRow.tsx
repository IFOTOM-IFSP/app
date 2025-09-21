import { FontSize, FontWeight } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import React from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface SwitchRowProps {
  label: React.ReactNode; // Alterado de string para React.ReactNode
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function SwitchRow({
  label,
  value,
  onValueChange,
  style,
  labelStyle,
}: SwitchRowProps) {
  const accentColor = useThemeValue("primary");
  const trackColor = useThemeValue("disabledBackground");
  const thumbColor = useThemeValue("textWhite");

  const handlePress = () => {
    onValueChange(!value);
  };

  // Se o label for um texto simples, usa o nosso ThemedText. Se for um componente, renderiza-o diretamente.
  const LabelComponent =
    typeof label === "string" ? (
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    ) : (
      label
    );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}>
      <View style={{ flex: 1, marginRight: 10 }}>{LabelComponent}</View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: trackColor, true: accentColor }}
        thumbColor={thumbColor}
        ios_backgroundColor={trackColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
