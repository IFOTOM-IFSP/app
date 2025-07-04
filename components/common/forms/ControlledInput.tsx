import { ThemedInput, ThemedInputProps } from "@/components/ui/ThemedInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { FontSize, Margin } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet } from "react-native";

type ControlledInputProps<T extends FieldValues> = ThemedInputProps & {
  name: Path<T>;
  control: Control<T>;
};

export function ControlledInput<T extends FieldValues>({
  name,
  control,
  ...themedInputProps 
}: ControlledInputProps<T>) {
  const destructiveColor = useThemeValue("warning");

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        
        const displayValue =
          typeof value === "number" && isNaN(value) ? "" : String(value ?? "");

        return (
          <>
          <ThemedInput
            {...themedInputProps}
            value={value?.toString() ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            style={
              error ? { borderColor: destructiveColor, borderWidth: 1 } : {}
            }
          />
          {error && (
            <ThemedText style={styles.errorText}>{error.message}</ThemedText>
          )}
        </>
      )}}
    />
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: Colors.light.warning,
    fontSize: FontSize.xs,
    marginTop: Margin.xs,
    marginLeft: Margin.xs,
  },
});
