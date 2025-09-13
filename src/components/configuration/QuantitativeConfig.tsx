import { AnalysisSetupFormData, analysisSetupSchema } from "@/models/analysis";
import { useAnalysisFlowActions } from "@/src/features/analysis/analysisFlowContext";
import { useAnalysisStore } from "@/store/analysisStore";
import { useCurveStore } from "@/store/curveStore";
import { useProfileStore } from "@/store/profileStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { FormSection } from "@/src/components/configuration/FormSection";
import { SelectionInput } from "@/src/components/ui/SelectionInput";
import { View } from "react-native";
import { ControlledFormField } from "./ControlledFormField";
import { ControlledSwitch } from "./ControlledSwitch";
import { FormWrapper } from "./FormWrapper";

export default function AnalysisConfigurationScreen() {
  const {
    loadProfiles,
    profiles,
    isLoading: profilesLoading,
  } = useProfileStore();
  const { loadCurves, curves } = useCurveStore();
  const { handleConfigurationStep } = useAnalysisFlowActions();
  const { startAnalysis, status } = useAnalysisStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<AnalysisSetupFormData>({
    resolver: zodResolver(analysisSetupSchema),
    mode: "onBlur",
    defaultValues: {
      analysisName: "",
      substance: "",
      hasDefinedCurve: false,
      hasCalibratedSpectrometer: false,
    },
  });

  const hasDefinedCurve = watch("hasDefinedCurve");
  const hasCalibratedSpectrometer = watch("hasCalibratedSpectrometer");

  useEffect(() => {
    loadProfiles();
    loadCurves();
  }, []);

  const onSubmit = (data: AnalysisSetupFormData) => {
    startAnalysis(data);
    handleConfigurationStep(data);
  };

  const profileOptions = profiles.map((p) => ({ label: p.name, value: p.id }));

  return (
    <View>
      {/* <TitleSection
        title="Configurar Análise"
        subtitle="Preencha os detalhes para iniciar sua análise quantitativa."
        style={{ padding: 0 }}
      /> */}
      <FormWrapper
        buttonTitle="Próximo Passo"
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={status === "calibrating"}>
        <FormSection title="Informações Básicas">
          <ControlledFormField
            name="analysisName"
            control={control}
            label="Nome da Análise"
            placeholder="Ex: Análise de Glicose"
          />
          <ControlledFormField
            name="substance"
            control={control}
            label="Substância"
            placeholder="Ex: Glicose"
          />
          <ControlledFormField
            name="wavelength"
            control={control}
            label="Comprimento de Onda (nm)"
            placeholder="Ex: 540"
            keyboardType="numeric"
          />
        </FormSection>

        <FormSection title="Calibração do Equipamento">
          <ControlledSwitch
            name="hasCalibratedSpectrometer"
            control={control}
            label="Já possui um perfil de calibração?"
          />
          {hasCalibratedSpectrometer && (
            <Controller
              name="selectedProfileId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectionInput
                  label="Perfil do Espectrômetro"
                  options={profileOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  placeholder={
                    profilesLoading ? "Carregando..." : "Selecione um perfil"
                  }
                />
              )}
            />
          )}
        </FormSection>

        <FormSection title="Curva de Calibração">
          <ControlledSwitch
            name="hasDefinedCurve"
            control={control}
            label="Já possui uma curva de calibração?"
          />
          {hasDefinedCurve && (
            <>
              <ControlledFormField
                name="slope_m"
                control={control}
                label="Coeficiente Angular (m)"
                placeholder="Valor da inclinação da reta"
                keyboardType="numeric"
              />
              <ControlledFormField
                name="intercept_b"
                control={control}
                label="Coeficiente Linear (b)"
                placeholder="Valor do intercepto"
                keyboardType="numeric"
              />
            </>
          )}
        </FormSection>
      </FormWrapper>
    </View>
  );
}
