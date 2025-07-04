import { ControlledInput } from "@/components/common/forms/ControlledInput";
import { ControlledSwitch } from "@/components/common/forms/ControlledSwitch";
import { FormWrapper } from "@/components/common/forms/FormWrapper";
import { FormSection } from "@/components/ui/FormSection";
import {
  AnalysisSetup,
  analysisSetupMasterSchema,
} from "@/schema/analysisSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

type QuantitativeSetupData = Extract<
  AnalysisSetup,
  { analysisType: "quantitative" }
>;

interface FormProps {
  onSubmit: (data: QuantitativeSetupData) => void;
}

export function QuantitativeSetupForm({ onSubmit }: FormProps) {
  // A configuração do useForm está perfeita.
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<AnalysisSetup>({
    resolver: zodResolver(analysisSetupMasterSchema),
    defaultValues: {
      analysisType: "quantitative",
      analysisName: "Dosagem de Amostra",
      analyteName: "",
      solvent: "Água Destilada",
      unit: "mg/L",
      opticalPath: 1,
      useCalibrationCurve: false,
      targetWavelength: NaN,
      slope: undefined,
      intercept: undefined,
    },
  });

  const useExistingCurve = watch("useCalibrationCurve");

  return (
    <FormWrapper
      onSubmit={handleSubmit(onSubmit)}
      buttonTitle="Próximo: Capturar Referências"
      isSubmitting={isSubmitting}>
      <FormSection title="1. Detalhes da Análise">
        <ControlledInput
          name="analysisName"
          control={control}
          label="Nome da Análise"
        />
        <ControlledInput
          name="analyteName"
          control={control}
          label="Nome do Analito (Opcional)"
        />
        <ControlledInput
          name="solvent"
          control={control}
          label="Solvente / Matriz (Opcional)"
        />
      </FormSection>

      <FormSection title="2. Parâmetros da Medição">
        <ControlledInput
          name="targetWavelength"
          control={control}
          label="Comprimento de Onda Alvo (nm)"
          keyboardType="numeric"
        />
        <ControlledInput
          name="unit"
          control={control}
          label="Unidade de Concentração"
          placeholder="mg/L, ppm, mol/L..."
        />
        {/* 👇 CAMPO ADICIONADO QUE ESTAVA FALTANDO 👇 */}
        <ControlledInput
          name="opticalPath"
          control={control}
          label="Caminho Óptico (cm)"
          keyboardType="numeric"
        />
      </FormSection>

      <FormSection title="3. Curva de Calibração" children={undefined}>
        <ControlledSwitch
          name="useCalibrationCurve"
          control={control}
          label="Usar curva existente (m e b)?"
        />
        {useExistingCurve && (
          <>
            <ControlledInput
              name="slope"
              control={control}
              label="Slope (m)"
              keyboardType="numeric"
            />
            <ControlledInput
              name="intercept"
              control={control}
              label="Intercepto (b)"
              keyboardType="numeric"
            />
          </>
        )}
      </FormSection>
    </FormWrapper>
  );
}
