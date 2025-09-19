import { Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import BackButton from "@/src/components/ui/BackButton";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormSection } from "../../form/FormSection";
import { FormWrapper } from "../../form/FormWrapper";
import { ControlledFormField } from "../../form/ControlledFormField";
import { ControlledSwitch } from "../../form/ControlledSwitch";
import { ApiClient, HttpError } from "@/services/http";
import { ENV } from "@/config/env";
import { useDeviceProfile } from "@/store/deviceProfile";
import { useVectorsStore } from "@/store/analysisVectors";
import type { QuantAnalyzeRequest, QuantAnalyzeResponse } from "@/types/api";

const quantitativeSchema = z.object({
  lambda_nm: z.coerce.number({ invalid_type_error: "Informe o λ" }).min(200).max(1100),
  window_nm: z.coerce.number().min(1).max(50).default(4),
  m: z.coerce.number({ invalid_type_error: "Informe o coeficiente m" }),
  b: z.coerce.number({ invalid_type_error: "Informe o coeficiente b" }),
  frames_per_burst: z.coerce.number().int().min(1).max(200).default(10),
  ref_after_sample: z.boolean().default(false),
});

export type QuantitativeFormData = z.infer<typeof quantitativeSchema>;

export default function QuantitativeFormsScreen() {
  const text = useThemeValue("text");
  const tint = useThemeValue("tint");
  const cardBackground = useThemeValue("card");
  const secondaryText = useThemeValue("textSecondary");

  const { control, handleSubmit, setValue } = useForm<QuantitativeFormData>({
    resolver: zodResolver(quantitativeSchema),
    mode: "onBlur",
    defaultValues: {
      lambda_nm: 540,
      window_nm: 4,
      m: 1,
      b: 0,
      frames_per_burst: 10,
      ref_after_sample: false,
    },
  });

  const { profile, load } = useDeviceProfile();
  const { dark, ref, sample, refAfter } = useVectorsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuantAnalyzeResponse | null>(null);

  const api = useMemo(() => new ApiClient(ENV.API_BASE_URL), []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  useEffect(() => {
    api.health().catch(() => {
      Alert.alert("Aviso", "API offline no momento.");
    });
  }, [api]);

  useEffect(() => {
    if (profile?.pixel_to_wavelength?.rmse_nm) {
      setValue("window_nm", Math.max(2, Math.round(profile.pixel_to_wavelength.rmse_nm * 2)));
    }
  }, [profile, setValue]);

  const handleCalibrate = () => {
    router.push("/(tabs)/analysis/calibration");
  };

  const onSubmit = async (data: QuantitativeFormData) => {
    if (!profile) {
      Alert.alert("Perfil obrigatório", "Calibre o equipamento antes de prosseguir.");
      return;
    }
    const rmse = profile.pixel_to_wavelength.rmse_nm ?? 0;
    if (rmse > 2) {
      Alert.alert("Calibração imprecisa", "RMSE acima de 2 nm. Refaça a calibração.");
      return;
    }
    if (!dark.length || !ref.length || !sample.length) {
      Alert.alert("Capturas incompletas", "Capture vetores de escuro, referência e amostra antes de analisar.");
      return;
    }
    const expectedFrames = data.frames_per_burst;
    if (
      expectedFrames &&
      (dark.length !== expectedFrames || ref.length !== expectedFrames || sample.length !== expectedFrames)
    ) {
      Alert.alert(
        "Quantidade de frames divergente",
        `Esperava ${expectedFrames} frames por burst, mas recebeu D=${dark.length}, R=${ref.length}, S=${sample.length}.`
      );
      return;
    }
    if (data.ref_after_sample && (!refAfter || !refAfter.length)) {
      Alert.alert(
        "Referência ausente",
        "Ative esta opção apenas após capturar um burst de referência após a amostra."
      );
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const payload: QuantAnalyzeRequest = {
        lambda_nm: data.lambda_nm,
        window_nm: data.window_nm ?? 4,
        calibration: { m: data.m, b: data.b },
        device_profile: profile,
        dark: { frames: dark },
        ref: { frames: ref },
        sample: { frames: sample },
      };

      const maybeRefAfter = data.ref_after_sample ? refAfter : undefined;
      const response = await api.analyzeQuant(
        maybeRefAfter && maybeRefAfter.length
          ? { ...payload, pseudo_double_beam: { ref_after: { frames: maybeRefAfter } } }
          : payload
      );
      setResult(response);
      Alert.alert(
        "Análise concluída",
        `C = ${response.C.toFixed(4)}\nA = ${response.A_mean.toFixed(4)} ± ${response.A_sd.toFixed(4)}`
      );
    } catch (error) {
      if (error instanceof HttpError) {
        const message =
          typeof error.body === "string" ? error.body : JSON.stringify(error.body, null, 2);
        Alert.alert("Erro na API", message);
      } else {
        Alert.alert("Erro inesperado", (error as Error).message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <BackButton color={text} style={styles.baseContainer} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}> 
            <Text style={styles.stepBadgeText}>λ</Text>
          </View>
          <ThemedText style={styles.headerTitle}>Análise Quantitativa</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ThemedText style={styles.instructions}>
        Configure os parâmetros e envie os vetores capturados para obter o resultado.
      </ThemedText>

      <View style={[styles.profileCard, { backgroundColor: cardBackground }]}>
        <View style={styles.profileHeader}>
          <ThemedText style={styles.profileTitle}>Perfil ativo</ThemedText>
          <Button title="Calibrar" onPress={handleCalibrate} variant="outline" style={styles.calibrateButton} />
        </View>
        {profile ? (
          <View style={styles.profileBody}>
            <ThemedText style={[styles.profileText, { color: text }]}>hash: {profile.device_hash}</ThemedText>
            <ThemedText style={[styles.profileText, { color: secondaryText }]}>
              RMSE: {(profile.pixel_to_wavelength.rmse_nm ?? 0).toFixed(2)} nm
            </ThemedText>
          </View>
        ) : (
          <ThemedText style={[styles.profileText, { color: secondaryText }]}>Nenhum perfil carregado.</ThemedText>
        )}
      </View>

      <FormWrapper
        buttonTitle="Executar análise"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}>
        <FormSection title="Parâmetros da análise">
          <ControlledFormField
            name="lambda_nm"
            control={control}
            label="Comprimento de onda (nm)"
            placeholder="Ex: 540"
            keyboardType="numeric"
            info="λ alvo para a absorbância."
          />
          <ControlledFormField
            name="window_nm"
            control={control}
            label="Janela (±nm)"
            placeholder="Ex: 4"
            keyboardType="numeric"
            info="Largura da janela para média espectral."
          />
          <ControlledFormField
            name="m"
            control={control}
            label="Coeficiente angular (m)"
            placeholder="Inclinação da curva"
            keyboardType="numeric"
            info="Coeficiente m da curva de calibração."
          />
          <ControlledFormField
            name="b"
            control={control}
            label="Coeficiente linear (b)"
            placeholder="Intercepto"
            keyboardType="numeric"
            info="Coeficiente b da curva de calibração."
          />
          <ControlledFormField
            name="frames_per_burst"
            control={control}
            label="Frames por burst"
            placeholder="Ex: 10"
            keyboardType="numeric"
            info="Quantidade esperada de frames em cada burst."/>
          <ControlledSwitch
            name="ref_after_sample"
            control={control}
            label="Referência após a amostra"
            info="Marque se capturou um burst de referência após a amostra."
          />
        </FormSection>
      </FormWrapper>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={styles.resultTitle}>Resultado</ThemedText>
          <ThemedText style={styles.resultText}>
            Concentração: {result.C.toFixed(4)} (CI95: {result.CI95?.low?.toFixed(4) ?? "-"} – {result.CI95?.high?.toFixed(4) ?? "-"})
          </ThemedText>
          <ThemedText style={styles.resultText}>
            Absorbância: {result.A_mean.toFixed(4)} ± {result.A_sd.toFixed(4)} (CV {result.CV.toFixed(2)}%)
          </ThemedText>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
  profileCard: {
    padding: Padding.md,
    borderRadius: 12,
    marginBottom: Margin.lg,
    gap: 12,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileBody: {
    gap: 4,
  },
  profileText: {
    fontSize: 14,
  },
  calibrateButton: {
    width: 120,
  },
  resultCard: {
    marginTop: Margin.lg,
    padding: Padding.md,
    borderRadius: 12,
    gap: 6,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  resultText: {
    fontSize: 14,
  },
});
