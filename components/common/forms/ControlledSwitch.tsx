import { SwitchRow, SwitchRowProps } from "@/components/ui/SwitchRow";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type BaseSwitchProps = Omit<
  SwitchRowProps,
  "value" | "onValueChange" | "label"
>;

type ControlledSwitchProps<T extends FieldValues> = BaseSwitchProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
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
