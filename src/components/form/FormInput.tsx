import {
  BorderRadius,
  FontSize,
  FontWeight,
  LayoutSize,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputProps extends ComponentProps<typeof TextInput> {}

export function Input(props: InputProps) {
  const textColor = useThemeValue("text");
  const placeholderColor = useThemeValue("disabledText");
  const backgroundColor = useThemeValue("background");
  const borderColor = useThemeValue("border");
  const shadowColor = useThemeValue("shadow");

  return (
    <TextInput
      style={[
        styles.input,
        {
          color: textColor,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          shadowColor: shadowColor,
        },
        props.style,
      ]}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
}

interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  const errorColor = useThemeValue("warning");

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Input {...inputProps} />
      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    width: "100%",
    marginBottom: Margin.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
    color: "#333",
  },
  errorText: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
  },
  input: {
    width: "100%",
    height: LayoutSize.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Padding.lg,
    fontSize: FontSize.md,
    borderWidth: 0.8,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
