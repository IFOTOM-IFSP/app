import { Spacing } from "@/constants/Styles";
import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText"; // Ajuste o caminho se necessário

// Importa os "blocos de Lego" que vamos usar
import { useThemeValue } from "@/hooks/useThemeValue";
import { Icon, IconLibrary } from "./Icon";
import { IconContainer } from "./IconContainer";

interface IconButtonProps {
  onPress: () => void;
  iconName: string;
  iconLibrary: IconLibrary;
  label?: string;
  accessibilityLabel: string;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function IconButton({
  onPress,
  iconName,
  iconLibrary,
  label,
  accessibilityLabel,
  iconSize,
  iconColor,
  backgroundColor,
  style,
  textStyle,
}: IconButtonProps) {
  const themeTextColor = useThemeValue("text");

  const iconElement = (
    <Icon
      library={iconLibrary}
      name={iconName}
      size={iconSize}
      color={iconColor || themeTextColor}
    />
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button">
      {backgroundColor ? (
        <IconContainer backgroundColor={backgroundColor}>
          {iconElement}
        </IconContainer>
      ) : (
        iconElement
      )}

      {label && (
        <ThemedText style={[styles.label, textStyle]}>{label}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
    minWidth: 48,
  },
  label: {
    fontSize: 12,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
});
