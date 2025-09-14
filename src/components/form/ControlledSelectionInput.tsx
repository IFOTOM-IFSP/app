import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { SelectionInput } from "./SelectionInput"; // Ajuste o caminho se necessário

// Props do componente base que não serão controladas pelo Form
type BaseSelectionProps = Omit<
  React.ComponentProps<typeof SelectionInput>,
  "selectedValue" | "onSelect"
>;

// Adiciona as props do React Hook Form
type ControlledSelectionInputProps<T extends FieldValues> =
  BaseSelectionProps & {
    name: Path<T>;
    control: Control<T>;
  };

/**
 * Um componente de seleção que se integra com o React Hook Form.
 */
export function ControlledSelectionInput<T extends FieldValues>({
  name,
  control,
  ...selectionInputProps
}: ControlledSelectionInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectionInput
          {...selectionInputProps}
          selectedValue={value}
          onSelect={onChange}
        />
      )}
    />
  );
}
