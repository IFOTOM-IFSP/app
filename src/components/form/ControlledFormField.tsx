import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { Spacing } from "@/src/constants/Styles";
import React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { StyleSheet, View } from "react-native";

type ThemedInputProps = React.ComponentProps<typeof ThemedInput>;

type ControlledFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = Omit<ThemedInputProps, "value" | "onChangeText" | "onBlur" | "label"> & {
  name: TName;
  control: Control<TFieldValues>;
  /** Texto acima do input (renderizado por este wrapper, não pelo ThemedInput) */
  label?: string;
  /** Slot para botão/ícone à direita do label (ex.: ℹ︎ / “Saiba mais”) */
  labelRightAccessory?: React.ReactNode;
  /** Help text opcional abaixo do campo */
  info?: string;
};

export function ControlledFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: ControlledFormFieldProps<TFieldValues, TName>) {
  const {
    name,
    control,
    label,
    labelRightAccessory,
    info,
    variant,
    ...inputProps
  } = props;

  const { field, fieldState } = useController({ name, control });
  const showError = !!fieldState.error?.message;
  const effectiveVariant = showError ? "error" : variant ?? "default";

  // Normaliza valor para string, já que TextInput trabalha com string.
  const raw = field.value as any;
  const stringValue =
    raw === undefined || raw === null
      ? ""
      : typeof raw === "string"
      ? raw
      : String(raw);

  return (
    <View style={styles.container}>
      {label ? (
        <View style={styles.labelRow}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {labelRightAccessory ?? null}
        </View>
      ) : null}

      <ThemedInput
        {...inputProps}
        value={stringValue}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        variant={effectiveVariant as any}
      />

      {showError ? (
        <ThemedText style={styles.errorText}>
          {String(fieldState.error?.message)}
        </ThemedText>
      ) : info ? (
        <ThemedText style={styles.infoText}>{info}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  label: { fontSize: 16, fontWeight: "600" },
  errorText: { marginTop: 4, fontSize: 12, color: "#ef4444" },
  infoText: { marginTop: 4, fontSize: 12, opacity: 0.8 },
});

export default ControlledFormField;
