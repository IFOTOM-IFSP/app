import { ThemedText } from "@/src/components/ui/ThemedText";
import { Spacing } from "@/src/constants/Styles";
import React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { StyleSheet, Switch, View } from "react-native";

type ControlledSwitchProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  /** Slot para botão/ícone à direita do label (ex.: ℹ︎) */
  labelRightAccessory?: React.ReactNode;
  /** Help text opcional abaixo do switch */
  info?: string;
  disabled?: boolean;
};

export function ControlledSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  labelRightAccessory,
  info,
  disabled,
}: ControlledSwitchProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });
  const value = !!field.value;

  return (
    <View style={styles.container}>
      {label ? (
        <View style={styles.labelRow}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {labelRightAccessory ?? null}
        </View>
      ) : null}

      <View style={styles.switchRow}>
        <Switch
          value={value}
          onValueChange={field.onChange}
          disabled={disabled}
        />
      </View>

      {fieldState.error?.message ? (
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  errorText: { marginTop: 4, fontSize: 12, color: "#ef4444" },
  infoText: { marginTop: 4, fontSize: 12, opacity: 0.8 },
});

export default ControlledSwitch;
