import { SwitchRow, SwitchRowProps } from "@/components/ui/SwitchRow";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

// Removemos 'label' de SwitchRowProps para que seja obrigatório em ControlledSwitchProps
type BaseSwitchProps = Omit<
  SwitchRowProps,
  "value" | "onValueChange" | "label"
>;

// Props para o nosso componente controlado, com Generics para type safety
type ControlledSwitchProps<T extends FieldValues> = BaseSwitchProps & {
  name: Path<T>;
  control: Control<T>;
  label: string; // O label é obrigatório para um switch controlado
};

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
