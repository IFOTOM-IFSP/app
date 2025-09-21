import { ThemedInput, ThemedInputProps } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Spacing } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

type ControlledFormFieldProps<T extends FieldValues> = ThemedInputProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
};

export function ControlledFormField<T extends FieldValues>({
  name,
  control,
  label,
  ...themedInputProps
}: ControlledFormFieldProps<T>) {
  const destructiveColor = useThemeValue("warning");
  const labelColor = useThemeValue("textSecondary");

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
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
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.xs,
    marginTop: Margin.xs,
    marginLeft: Margin.xs,
  },
});
