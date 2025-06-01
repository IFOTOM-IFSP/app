import React, { JSX } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Colors } from "../../constants/Colors";

interface IconButtonProps {
  onPress: () => void;
  iconElement: JSX.Element;
  labelText: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  iconElement,
  labelText,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[defaultStyles.container, style]}
      onPress={onPress}>
      {iconElement}
      <Text style={[defaultStyles.label, textStyle]}>{labelText}</Text>
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
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
});

export default IconButton;
