import { Margin, Padding, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import BackButton from "@/src/components/ui/BackButton";
import { Button } from "@/src/components/ui/Button";
import { Tag } from "@/src/components/ui/Tag";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { InfoModal } from "@/src/components/ui/InfoModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
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
import { pt } from "@/src/i18n/pt";

const strings = pt.analysis.quantitative;
const modals = pt.modals;

const quantitativeSchema = z.object({
  substance: z
    .string({ required_error: "Informe a substância" })
    .trim()
    .min(1, "Informe a substância"),
  lambda_nm: z.coerce.number({ invalid_type_error: "Informe o λ" }).min(200).max(1100),
  window_nm: z.coerce.number().min(1).max(50).default(4),
  m: z.coerce.number({ invalid_type_error: "Informe o coeficiente m" }),
  b: z.coerce.number({ invalid_type_error: "Informe o coeficiente b" }),
  frames_per_burst: z.coerce.number().int().min(1).max(200).default(10),
  ref_after_sample: z.boolean().default(false),
});

export type QuantitativeFormData = z.infer<typeof quantitativeSchema>;

type RmseBadge = { variant: "success" | "warning" | "error"; label: string };

export default function QuantitativeFormsScreen() {
  const text = useThemeValue("text");
  const tint = useThemeValue("primary");
  const cardBackground = useThemeValue("card");
  const secondaryText = useThemeValue("textSecondary");

  const { control, handleSubmit, setValue, watch, reset } = useForm<QuantitativeFormData>({
    resolver: zodResolver(quantitativeSchema),
    mode: "onBlur",
    defaultValues: {
      substance: "",
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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRmseModal, setShowRmseModal] = useState(false);
  const [showWindowModal, setShowWindowModal] = useState(false);
  const [showPseudoModal, setShowPseudoModal] = useState(false);
  const [showCurveModal, setShowCurveModal] = useState(false);

  const profilePromptedRef = useRef(false);
  const rmsePromptedRef = useRef(false);
  const pseudoPromptedRef = useRef(false);

  const api = useMemo(() => new ApiClient(ENV.API_BASE_URL), []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  useEffect(() => {
    api.health().catch(() => {
      Alert.alert("Aviso", "API offline no momento.");
    });
  }, [api]);

  const rmse = profile?.pixel_to_wavelength?.rmse_nm ?? null;

  useEffect(() => {
    if (rmse && rmse > 0) {
      setValue("window_nm", Math.max(2, Math.round(rmse * 2)));
    }
  }, [rmse, setValue]);

  useEffect(() => {
    if (!profile && !profilePromptedRef.current) {
      profilePromptedRef.current = true;
      setShowProfileModal(true);
    }
  }, [profile]);

  useEffect(() => {
    if (profile && typeof rmse === "number" && rmse > 2 && !rmsePromptedRef.current) {
      rmsePromptedRef.current = true;
      setShowRmseModal(true);
    }
  }, [profile, rmse]);

  const refAfterToggle = watch("ref_after_sample");
  useEffect(() => {
    if (refAfterToggle && !pseudoPromptedRef.current) {
      pseudoPromptedRef.current = true;
      setShowPseudoModal(true);
    }
  }, [refAfterToggle]);

  const handleCalibrate = () => {
    router.push("/(tabs)/analysis/calibration");
  };

  const rmseBadge = (): RmseBadge | null => {
    if (rmse === null || Number.isNaN(rmse)) {
      return null;
    }
    if (rmse <= 2) return { variant: "success", label: strings.profileChipRmse(rmse.toFixed(2)) };
    if (rmse <= 3) return { variant: "warning", label: strings.profileChipRmse(rmse.toFixed(2)) };
    return { variant: "error", label: strings.profileChipRmse(rmse.toFixed(2)) };
  };

  const isContinueDisabled = !profile || (typeof rmse === "number" && rmse > 2);
  const disableReason = !profile
    ? strings.validators.missingProfile
    : typeof rmse === "number" && rmse > 2
    ? strings.validators.poorProfile(rmse)
    : null;

  const onSubmit = async (data: QuantitativeFormData) => {
    if (!profile) {
      Alert.alert("Perfil obrigatório", strings.validators.missingProfile);
      setShowProfileModal(true);
      return;
    }
    const rmseValue = profile.pixel_to_wavelength.rmse_nm ?? 0;
    if (rmseValue > 2) {
      Alert.alert("Calibração imprecisa", strings.validators.poorProfile(rmseValue));
      setShowRmseModal(true);
      return;
    }
    if (!dark.length || !ref.length || !sample.length) {
      Alert.alert("Capturas incompletas", strings.validators.missingVectors);
      return;
    }
    const expectedFrames = data.frames_per_burst;
    if (
      expectedFrames &&
      (dark.length !== expectedFrames || ref.length !== expectedFrames || sample.length !== expectedFrames)
    ) {
      Alert.alert(
        "Quantidade de frames divergente",
        strings.validators.inconsistentFrames(expectedFrames, dark.length, ref.length, sample.length)
      );
      return;
    }
    if (data.ref_after_sample && (!refAfter || !refAfter.length)) {
      Alert.alert("Referência ausente", strings.validators.missingRefAfter);
      return;
    }
    if (Math.abs(data.m) < 1e-6) {
      Alert.alert("Curva inválida", strings.validators.invalidSlope);
      setShowCurveModal(true);
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
        const message = typeof error.body === "string" ? error.body : JSON.stringify(error.body, null, 2);
        Alert.alert("Erro na API", message);
      } else {
        Alert.alert("Erro inesperado", (error as Error).message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <BackButton color={text} style={styles.baseContainer} />
        <ThemedText style={styles.headerTitle}>{strings.headerTitle}</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ThemedText style={[styles.instructions, { color: secondaryText }]}>{strings.heroCopy}</ThemedText>

      <View style={[styles.profileCard, { backgroundColor: cardBackground }]}> 
        <View style={styles.profileHeader}> 
          <ThemedText style={styles.profileTitle}>Perfil do equipamento</ThemedText>
          <TouchableOpacity onPress={() => setShowProfileModal(true)} accessibilityRole="button">
            <ThemedText style={[styles.infoLink, { color: tint }]}>ℹ︎</ThemedText>
          </TouchableOpacity>
        </View>
        {profile ? (
          <>
            <View style={styles.profileTags}> 
              <Tag
                text={`${strings.profileChipPrefix} ${profile.device_hash}`}
                variant="primary"
                size="sm"
              />
              {rmseBadge() ? (
                <TouchableOpacity onPress={() => setShowRmseModal(true)} accessibilityRole="button">
                  <Tag text={rmseBadge()!.label} variant={rmseBadge()!.variant} size="sm" />
                </TouchableOpacity>
              ) : (
                <Tag text="RMSE indisponível" variant="warning" size="sm" />
              )}
            </View>
            <Button title={strings.profileActions.recalibrate} onPress={handleCalibrate} variant="outline" />
          </>
        ) : (
          <>
            <ThemedText style={[styles.profileText, { color: secondaryText }]}>{strings.missingProfileChip}</ThemedText>
            <Button title={strings.profileActions.calibrateNow} onPress={handleCalibrate} />
          </>
        )}
      </View>

      <FormWrapper
        buttonTitle={strings.cta}
        isSubmitting={isSubmitting}
        buttonDisabled={isContinueDisabled}
        onSubmit={handleSubmit(onSubmit)}>
        <FormSection title="Parâmetros da análise">
          <ControlledFormField
            name="substance"
            control={control}
            label={strings.form.substanceLabel}
            placeholder="Ex: Nitrito"
          />
          <ControlledFormField
            name="lambda_nm"
            control={control}
            label={strings.form.wavelengthLabel}
            placeholder="Ex: 540"
            keyboardType="numeric"
            info={strings.form.wavelengthHelp}
          />
          <ControlledFormField
            name="window_nm"
            control={control}
            label={strings.form.windowLabel}
            placeholder="Ex: 4"
            keyboardType="numeric"
            info={modals.window.title}
            onInfoPress={() => setShowWindowModal(true)}
          />
          <View style={styles.curveHeader}>
            <ThemedText style={styles.curveTitle}>Curva de calibração</ThemedText>
            <TouchableOpacity onPress={() => setShowCurveModal(true)} accessibilityRole="button">
              <ThemedText style={[styles.infoLink, { color: tint }]}>Saiba mais</ThemedText>
            </TouchableOpacity>
          </View>
          <ControlledFormField
            name="m"
            control={control}
            label={strings.form.slopeLabel}
            placeholder="Inclinação da curva"
            keyboardType="numeric"
            info={modals.curve.title}
            onInfoPress={() => setShowCurveModal(true)}
          />
          <ControlledFormField
            name="b"
            control={control}
            label={strings.form.interceptLabel}
            placeholder="Intercepto"
            keyboardType="numeric"
            info={modals.curve.title}
            onInfoPress={() => setShowCurveModal(true)}
          />
          <ControlledFormField
            name="frames_per_burst"
            control={control}
            label={strings.form.framesLabel}
            placeholder="Ex: 10"
            keyboardType="numeric"
            info="Quantidade esperada de frames em cada burst."
          />
          <ControlledSwitch
            name="ref_after_sample"
            control={control}
            label={strings.form.pseudoDoubleBeam}
            info={modals.pseudoDoubleBeam.title}
            onInfoPress={() => setShowPseudoModal(true)}
          />
        </FormSection>
        {disableReason && (
          <ThemedText style={[styles.disableHint, { color: secondaryText }]}>{disableReason}</ThemedText>
        )}
        {result && (
          <View style={[styles.resultCard, { backgroundColor: cardBackground }]}> 
            <ThemedText style={styles.resultTitle}>Resultado</ThemedText>
            <ThemedText style={styles.resultText}>
              Concentração: {result.C.toFixed(4)} (CI95: {result.CI95?.low?.toFixed(4) ?? "-"} – {result.CI95?.high?.toFixed(4) ?? "-"})
            </ThemedText>
            <ThemedText style={styles.resultText}>
              Absorbância: {result.A_mean.toFixed(4)} ± {result.A_sd.toFixed(4)} (CV {result.CV.toFixed(2)}%)
            </ThemedText>
            <Button title="Limpar" variant="outline" onPress={handleReset} style={{ marginTop: Spacing.sm }} />
          </View>
        )}
      </FormWrapper>

      <InfoModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title={modals.profile.title}
        content={modals.profile.body}
        actions={
          <Button
            title={modals.profile.cta}
            onPress={() => {
              setShowProfileModal(false);
              handleCalibrate();
            }}
            style={{ marginHorizontal: Padding.lg }}
          />
        }
      />
      <InfoModal
        visible={showRmseModal}
        onClose={() => setShowRmseModal(false)}
        title={modals.rmse.title}
        content={modals.rmse.body}
        actions={
          <View style={styles.modalActions}>
            {modals.rmse.actions?.map((action) => (
              <Button
                key={action}
                title={action}
                variant="outline"
                onPress={() => setShowRmseModal(false)}
                style={{ marginBottom: Spacing.sm }}
              />
            ))}
          </View>
        }
      />
      <InfoModal
        visible={showPseudoModal}
        onClose={() => setShowPseudoModal(false)}
        title={modals.pseudoDoubleBeam.title}
        content={modals.pseudoDoubleBeam.body}
        actions={
          <Button
            title={modals.pseudoDoubleBeam.toggle}
            onPress={() => setShowPseudoModal(false)}
            style={{ marginHorizontal: Padding.lg }}
          />
        }
      />
      <InfoModal
        visible={showWindowModal}
        onClose={() => setShowWindowModal(false)}
        title={modals.window.title}
        content={modals.window.body}
      />
      <InfoModal
        visible={showCurveModal}
        onClose={() => setShowCurveModal(false)}
        title={modals.curve.title}
        content={modals.curve.body}
        actions={
          <Button
            title={modals.curve.cta}
            onPress={() => setShowCurveModal(false)}
            style={{ marginHorizontal: Padding.lg }}
          />
        }
      />
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  instructions: {
    fontSize: 16,
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
  profileText: {
    fontSize: 14,
  },
  profileTags: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  infoLink: {
    fontWeight: "600",
  },
  curveHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  curveTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  disableHint: {
    fontSize: 13,
    marginTop: Margin.sm,
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
  modalActions: {
    paddingHorizontal: Padding.lg,
    paddingBottom: Padding.lg,
  },
});
