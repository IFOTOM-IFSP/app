import { Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { SwitchRow, SwitchRowProps } from "@/src/components/ui/SwitchRow";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

// Remove as props que serão controladas pelo React Hook Form
type BaseSwitchProps = Omit<
  SwitchRowProps,
  "value" | "onValueChange" | "label"
>;

// Adiciona as props do React Hook Form e a nova prop 'info'
type ControlledSwitchProps<T extends FieldValues> = BaseSwitchProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  info?: string;
};

export function ControlledSwitch<T extends FieldValues>({
  name,
  control,
  label,
  info,
  ...switchRowProps
}: ControlledSwitchProps<T>) {
  const infoIconColor = useThemeValue("primary");

  const labelWithInfo = (
    <View style={styles.labelContainer}>
      <ThemedText style={styles.labelText}>{label}</ThemedText>
      {info && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => Alert.alert(label, info)}
          accessibilityLabel={`Informação sobre ${label}`}>
          <Feather name="help-circle" size={18} color={infoIconColor} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SwitchRow
          {...switchRowProps}
          label={labelWithInfo}
          value={value}
          onValueChange={onChange}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {},
  infoButton: {
    marginLeft: Spacing.md,
  },
});
