import { Colors } from "@/constants/Colors";
import {
  BorderRadius,
  FontSize,
  LayoutSize,
  Padding,
} from "@/constants/Styles";
import React, { ComponentProps } from "react";
import { StyleSheet, TextInput } from "react-native";

type FormInputProps = ComponentProps<typeof TextInput>;
export function FormInput(props: FormInputProps) {
  return (
    <TextInput
      style={[styles.input, { color: Colors.light.text }, props.style]}
      placeholderTextColor={Colors.light.gray}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: LayoutSize.inputHeight,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Padding.lg,
    fontSize: FontSize.md,
    borderWidth: 0.8,
    borderColor: Colors.light.borderColor,
    shadowColor: Colors.light.text,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
