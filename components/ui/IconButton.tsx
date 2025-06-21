import { ThemedText } from "@/components/ui/ThemedText";
import React, { JSX } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface IconButtonProps {
  onPress: () => void;
  iconElement: JSX.Element;

  labelText?: string;

  iconOnly?: boolean;

  accessibilityLabel: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  iconElement,
  labelText,
  iconOnly = false,
  accessibilityLabel,
  style,
  textStyle,
}) => {
  const containerStyles = [
    defaultStyles.container,
    iconOnly && defaultStyles.iconOnlyContainer,
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button">
      {iconElement}
      {labelText && !iconOnly && (
        <ThemedText style={[defaultStyles.label, textStyle]}>
          {labelText}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 6,
    minWidth: 80,
    minHeight: 70,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  iconOnlyContainer: {
    minWidth: 0,
    minHeight: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IconButton;
