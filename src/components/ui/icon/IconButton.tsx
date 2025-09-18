import { Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { Icon, IconLibrary } from "./Icon";

interface IconButtonProps {
  onPress: () => void;
  iconName: string;
  iconLibrary: IconLibrary;
  label?: string;
  accessibilityLabel: string;
  iconSize?: number;
  iconColor?: string;
  iconContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
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
  iconContainerStyle,
  style,
  textStyle,
}: IconButtonProps) {
  const defaultIconColor = useThemeValue("tint");

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.6}>
      <View style={[styles.iconContainerBase, iconContainerStyle]}>
        <Icon
          library={iconLibrary}
          name={iconName}
          size={iconSize}
          color={iconColor || defaultIconColor}
        />
      </View>

      {label && (
        <ThemedText style={[styles.label, textStyle]} numberOfLines={1}>
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  iconContainerBase: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
});
