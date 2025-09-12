import { AnalysisSetupFormData, analysisSetupSchema } from "@/models/analysis";
import { useAnalysisStore } from "@/store/analysisStore";
import { useBaselineStore } from "@/store/baselineStore";
import { useCurveStore } from "@/store/curveStore";
import { useProfileStore } from "@/store/profileStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenLayout } from "../layouts/ScreenLayout";

export default function QuantitativeConfig() {
  const {
    profiles,
    loadProfiles,
    isLoading: profilesLoading,
  } = useProfileStore();
  const { curves, loadCurves } = useCurveStore();
  const {
    darkSignalImages,
    whiteSignalImages,
    isLoaded,
    loadBaselineFromStorage,
  } = useBaselineStore();
  const { startAnalysis } = useAnalysisStore();

  useEffect(() => {
    if (!isLoaded) {
      loadBaselineFromStorage();
    }
  }, [isLoaded, loadBaselineFromStorage]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<AnalysisSetupFormData>({
    resolver: zodResolver(analysisSetupSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const hasDefinedCurve = watch("hasDefinedCurve");
  const hasCalibratedSpectrometer = watch("hasCalibratedSpectrometer");

  const onSubmit = (data: AnalysisSetupFormData) => {
    startAnalysis(data);
    console.log("Formulário submetido:", data);

    if (!data.hasCalibratedSpectrometer) {
      router.push("/app/(tabs)/analysis/wave_length_peak_setup");
      return;
    }

    if (!data.hasDefinedCurve) {
      router.push("/(tabs)/analysis/CurveBuilder");
      return;
    }

    if (darkSignalImages && whiteSignalImages) {
      console.log("Linha de base encontrada. Perguntando ao usuário...");
      Alert.alert(
        "Linha de Base Existente",
        "Encontramos medições de escuro e branco salvas. Deseja usá-las ou medir novamente?",
        [
          {
            text: "Usar Existente",
            onPress: () => router.push("/(tabs)/analysis/measurement-sample"),
          },
          {
            text: "Medir Novamente",
            onPress: () => router.push("/(tabs)/analysis/capture-base"),
          },
        ]
      );
    } else {
      console.log("Linha de base não encontrada. Navegando para a captura.");
      router.push("/(tabs)/analysis/capture-base");
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Configurar Análise Quantitativa</Text>

        {/* Nome da Análise */}
        <Text style={styles.label}>Nome da Análise</Text>
        <Controller
          control={control}
          name="analysisName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.analysisName && (
          <Text style={styles.error}>{errors.analysisName.message}</Text>
        )}

        {/* Nome da Substância */}
        <Text style={styles.label}>Substância Analisada</Text>
        <Controller
          control={control}
          name="substance"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.substance && (
          <Text style={styles.error}>{errors.substance.message}</Text>
        )}

        {/* Comprimento de Onda */}
        <Text style={styles.label}>Comprimento de Onda (λ) em nm</Text>
        <Controller
          control={control}
          name="wavelength"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={String(value || "")}
              keyboardType="numeric"
            />
          )}
        />
        {errors.wavelength && (
          <Text style={styles.error}>{errors.wavelength.message}</Text>
        )}

        {/* Pergunta 1: Curva de Calibração */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Já possui uma curva de calibração?</Text>
          <Controller
            control={control}
            name="hasDefinedCurve"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>

        {hasDefinedCurve && (
          <View style={styles.conditionalContainer}>
            <Text style={styles.label}>Coeficiente Angular (m)</Text>
            <Controller
              name="slope_m"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={String(value || "")}
                  keyboardType="numeric"
                />
              )}
            />
            <Text style={styles.label}>Coeficiente Linear (b)</Text>
            <Controller
              name="intercept_b"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={String(value || "")}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.slope_m && (
              <Text style={styles.error}>{errors.slope_m.message}</Text>
            )}
          </View>
        )}

        {/* Pergunta 2: Aparelho Calibrado */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>O aparelho já foi calibrado?</Text>
          <Controller
            control={control}
            name="hasCalibratedSpectrometer"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>

        {hasCalibratedSpectrometer && (
          <View style={styles.conditionalContainer}>
            <Text style={styles.label}>Aparelho (Perfil Salvo)</Text>
            <View style={styles.pickerContainer}>
              <Controller
                control={control}
                name="selectedProfileId"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    enabled={!profilesLoading}>
                    <Picker.Item
                      label="Selecione um perfil..."
                      value={undefined}
                    />
                    {profiles.map((p) => (
                      <Picker.Item key={p.id} label={p.name} value={p.id} />
                    ))}
                  </Picker>
                )}
              />
            </View>
            {errors.selectedProfileId && (
              <Text style={styles.error}>
                {errors.selectedProfileId.message}
              </Text>
            )}
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <Button
            title="Próximo"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  conditionalContainer: {
    padding: 15,
    backgroundColor: "#fafafa",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
