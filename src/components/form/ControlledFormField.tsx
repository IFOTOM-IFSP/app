import { FontSize, FontWeight, Margin, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ThemedInput, ThemedInputProps } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ControlledFormFieldProps<T extends FieldValues> = ThemedInputProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  info?: string; // Propriedade de informação adicionada
};

export function ControlledFormField<T extends FieldValues>({
  name,
  control,
  label,
  info,
  ...themedInputProps
}: ControlledFormFieldProps<T>) {
  const destructiveColor = useThemeValue("warning");
  const labelColor = useThemeValue("textSecondary");
  const infoIconColor = useThemeValue("primary");

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            {info && (
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => Alert.alert(label, info)}
                accessibilityLabel={`Informação sobre ${label}`}>
                <Feather name="help-circle" size={18} color={infoIconColor} />
              </TouchableOpacity>
            )}
          </View>
          <ThemedInput
            {...themedInputProps}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={[
              themedInputProps.style,
              error && { borderColor: destructiveColor, borderWidth: 1 },
            ]}
          />
          {error && (
            <ThemedText style={[styles.errorText, { color: destructiveColor }]}>
              {error.message}
            </ThemedText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Margin.md,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  infoButton: {
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.xs,
    marginTop: Margin.xs,
    marginLeft: Margin.xs,
  },
});
