import { FontSize, FontWeight } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import {
  StyleSheet,
  Switch,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

export interface SwitchRowProps {
  label: string;
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

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}>
      <ThemedText style={[styles.label, { flex: 1 }, labelStyle]}>
        {label}
      </ThemedText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: trackColor, true: accentColor }}
        thumbColor={thumbColor}
        ios_backgroundColor={trackColor}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        
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
