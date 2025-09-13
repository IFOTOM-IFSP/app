import { SwitchRow, SwitchRowProps } from "@/src/components/ui/SwitchRow";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

// Remove as props que serão controladas pelo React Hook Form
type BaseSwitchProps = Omit<
  SwitchRowProps,
  "value" | "onValueChange" | "label"
>;

// Adiciona as props do React Hook Form
type ControlledSwitchProps<T extends FieldValues> = BaseSwitchProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
};

/**
 * Um componente de switch que se integra com o React Hook Form.
 * Ele renderiza um rótulo ao lado de um interruptor.
 */
export function ControlledSwitch<T extends FieldValues>({
  name,
  control,
  label,
  ...switchRowProps
}: ControlledSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SwitchRow
          {...switchRowProps}
          label={label}
          value={value}
          onValueChange={onChange}
        />
      )}
    />
  );
}
