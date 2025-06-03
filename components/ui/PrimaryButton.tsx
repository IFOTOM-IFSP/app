import { Colors } from "@/constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface PrimaryButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  activeOpacity?: number;
}

export function PrimaryButton({
  onPress,
  title,
  style,
  textStyle,
  disabled = false,
  loading = false,
  activeOpacity = 0.7,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[
        styles.button,
        disabled || loading ? styles.disabledButton : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={Colors.light.textWhite} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "90%",
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    borderRadius: 20,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: Colors.light.textWhite,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: Colors.light.gray,
    opacity: 0.7,
  },
});
