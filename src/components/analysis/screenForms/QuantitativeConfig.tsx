import { AnalysisSetupFormData, analysisSetupSchema } from "@/models/analysis";
import { useAnalysisFlowActions } from "@/src/features/analysis/analysisFlowContext";
import { useAnalysisStore } from "@/store/analysisStore";
import { useCurveStore } from "@/store/curveStore";
import { useProfileStore } from "@/store/profileStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { Margin } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import BackButton from "@/src/components/ui/BackButton";
import { Button } from "@/src/components/ui/Button";
import { SelectionInput } from "@/src/components/ui/SelectionInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  getShouldShowConfigModal,
  setShouldShowConfigModal,
} from "@/storage/settingsStorage";
import { Feather } from "@expo/vector-icons";
import { ControlledFormField } from "../../form/ControlledFormField";
import { ControlledSwitch } from "../../form/ControlledSwitch";
import { FormSection } from "../../form/FormSection";
import { FormWrapper } from "../../form/FormWrapper";
import { InfoModal } from "../../ui/InfoModal";

export default function QuantitativeFormsScreen() {
  const {
    loadProfiles,
    profiles,
    isLoading: profilesLoading,
  } = useProfileStore();
  const { loadCurves } = useCurveStore();
  const { handleConfigurationStep } = useAnalysisFlowActions();
  const { startAnalysis, status } = useAnalysisStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const text = useThemeValue("text");
  const tint = useThemeValue("tint");
  const primaryColor = useThemeValue("primary");

  useEffect(() => {
    const checkModalStatus = async () => {
      const shouldShow = await getShouldShowConfigModal();
      if (shouldShow) {
        setModalVisible(true);
      }
    };
    checkModalStatus();
  }, []);

  const { control, handleSubmit, watch } = useForm<AnalysisSetupFormData>({
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
  }, [loadProfiles, loadCurves]);

  const onSubmit = (data: AnalysisSetupFormData) => {
    startAnalysis(data);
    handleConfigurationStep(data);
  };

  const profileOptions = profiles.map((p) => ({ label: p.name, value: p.id }));

  const handleModalClose = () => {
    setModalVisible(false);
    if (dontShowAgain) {
      setShouldShowConfigModal(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <BackButton color={text} style={styles.baseContainer} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}>
            <Text style={styles.stepBadgeText}>2</Text>
          </View>
          <ThemedText style={styles.headerTitle}>Configurar Análise</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ThemedText style={styles.instructions}>
        Preencha os detalhes para iniciar sua análise quantitativa.
      </ThemedText>

      <InfoModal
        visible={isModalVisible}
        onClose={handleModalClose}
        icon={<Feather name="info" size={40} color={primaryColor} />}
        title="Configurar Análise Quantitativa"
        content={
          "Nesta tela, você irá inserir os parâmetros básicos para a sua análise, como o nome, a substância e o comprimento de onda.\n\nVocê também pode informar se já possui uma calibração do equipamento ou uma curva de calibração pronta para usar."
        }
        showDoNotShowAgain={true}
        onDoNotShowAgain={setDontShowAgain}
        actions={<Button title="Entendi" onPress={handleModalClose} />}
      />
      <FormWrapper
        buttonTitle="Próximo Passo"
        isSubmitting={status === "calibrating"}
        keyboardVerticalOffset={80}>
        <FormSection title="Informações Básicas">
          <ControlledFormField
            name="analysisName"
            control={control}
            label="Nome da Análise"
            placeholder="Ex: Análise de Glicose"
            info="Dê um nome único para identificar esta análise no seu histórico."
          />
          <ControlledFormField
            name="substance"
            control={control}
            label="Substância"
            placeholder="Ex: Glicose"
            info="Qual substância você está a tentar quantificar?"
          />
          <ControlledFormField
            name="wavelength"
            control={control}
            label="Comprimento de Onda (nm)"
            placeholder="Ex: 540"
            keyboardType="numeric"
            info="Insira o comprimento de onda (em nanômetros) de máxima absorção para a sua substância."
          />

          <ControlledSwitch
            name="hasCalibratedSpectrometer"
            control={control}
            label="Já possui um perfil de calibração?"
            info="Selecione se você já calibrou o espectrofotômetro e salvou um perfil de calibração."
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

          <ControlledSwitch
            name="hasDefinedCurve"
            control={control}
            label="Já possui uma curva de calibração?"
            info="Selecione se você já tem os coeficientes de uma curva de calibração para esta substância."
          />
          {hasDefinedCurve && (
            <>
              <ControlledFormField
                name="slope_m"
                control={control}
                label="Coeficiente Angular (m)"
                placeholder="Valor da inclinação da reta"
                keyboardType="numeric"
                info="O coeficiente angular (m) da equação da reta (y = mx + b) da sua curva de calibração."
              />
              <ControlledFormField
                name="intercept_b"
                control={control}
                label="Coeficiente Linear (b)"
                placeholder="Valor do intercepto"
                keyboardType="numeric"
                info="O coeficiente linear (b) da equação da reta (y = mx + b), onde a reta cruza o eixo Y."
              />
            </>
          )}
        </FormSection>

        <Button
          title="Próximo Passo"
          onPress={handleSubmit(onSubmit)}
          disabled={status === "calibrating"}
          loading={status === "calibrating"}
        />
      </FormWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    marginBottom: Margin.md,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  baseContainer: {
    padding: 0,
    backgroundColor: "transparent",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  instructions: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "left",
    marginBottom: Margin.lg,
    alignSelf: "center",
    width: "100%",
  },
  buttonContainer: {
    paddingBottom: 24,
  },
});
