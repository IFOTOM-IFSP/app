import { ENV } from "@/config/env";
import { ApiClient } from "@/services/http";
import { Button } from "@/src/components/ui/Button";
import { Tag } from "@/src/components/ui/Tag";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useVectorsStore } from "@/src/store/analysisVectors";
import {
  useDeviceProfile,
  type DeviceProfile,
} from "@/src/store/deviceProfileStore";
import { argMax, meanVector, polyfitPxToNm } from "@/src/utils/signal";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function InstrumentCalibrationWizard() {
  const [step, setStep] = useState<
    "intro" | "green" | "red" | "review" | "save"
  >("intro");
  const [greenNm] = useState(532);
  const [redNm] = useState(650);
  const roi = { x: 0, y: 0, width: 1024, height: 10 };
  const { setProfile } = useDeviceProfile();
  const vectors = useVectorsStore();
  const api = useMemo(() => new ApiClient(ENV.API_BASE_URL), []);

  const cardBackground = useThemeValue("card");
  const textColor = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");

  const vGreen = useMemo(() => meanVector(vectors.ref), [vectors.ref]);
  const vRed = useMemo(() => meanVector(vectors.sample), [vectors.sample]);

  const doFit = () => {
    const pxG = argMax(vGreen);
    const pxR = argMax(vRed);
    const fit = polyfitPxToNm([
      { px: pxG, nm: greenNm },
      { px: pxR, nm: redNm },
    ]);
    return { pxG, pxR, fit };
  };

  const onSave = async () => {
    const { fit } = doFit();
    const device_profile: DeviceProfile = {
      device_hash: "expo-managed-dev",
      pixel_to_wavelength: {
        a0: fit.a0,
        a1: fit.a1,
        a2: fit.a2,
        rmse_nm: fit.rmse,
      },
      roi,
      camera_meta: { wb: "locked" },
    };
    await setProfile(device_profile);
    try {
      await api.characterizeInstrument({
        frames_red: vectors.sample,
        frames_green: vectors.ref,
        roi,
        hints: { nm_green: greenNm, nm_red: redNm },
      });
    } catch {
      // best effort only
    }
    setStep("save");
  };

  const renderIntro = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Calibração do equipamento
      </Text>
      <Text style={[styles.body, { color: secondaryText }]}>
        Aponte os lasers (~532 e ~650 nm). Capture 10 frames para cada.
      </Text>
      <Button title="Capturar VERDE" onPress={() => setStep("green")} />
    </View>
  );

  const renderGreen = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Laser VERDE (~532 nm)
      </Text>
      <Text style={[styles.body, { color: secondaryText }]}>
        Use sua tela de captura para gravar um burst (vetores em ref).
      </Text>
      <Button title="Próximo: VERMELHO" onPress={() => setStep("red")} />
    </View>
  );

  const renderRed = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Laser VERMELHO (~650 nm)
      </Text>
      <Text style={[styles.body, { color: secondaryText }]}>
        Grave um burst (vetores em sample) e avance.
      </Text>
      <Button title="Revisar & Ajustar" onPress={() => setStep("review")} />
    </View>
  );

  const renderReview = () => {
    const { pxG, pxR, fit } = doFit();
    const rmseTagVariant: "success" | "warning" =
      fit.rmse < 2 ? "success" : "warning";
    return (
      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <Text style={[styles.title, { color: textColor }]}>
          Revisão & Ajuste
        </Text>
        <View style={styles.chipsContainer}>
          <Tag text={`px(G)=${pxG}`} variant="primary" size="sm" />
          <Tag text={`px(R)=${pxR}`} variant="primary" size="sm" />
          <Tag
            text={`a0=${fit.a0.toFixed(2)} a1=${fit.a1.toFixed(4)}${
              fit.a2 ? ` a2=${fit.a2.toExponential(2)}` : ""
            }`}
            variant="primary"
            size="sm"
          />
          <Tag
            text={`RMSE=${fit.rmse.toFixed(2)} nm`}
            variant={rmseTagVariant}
            size="sm"
          />
        </View>
        <Button title="Salvar perfil" onPress={onSave} />
      </View>
    );
  };

  const renderSave = () => (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <Text style={[styles.title, { color: textColor }]}>Perfil salvo</Text>
      <Text style={[styles.body, { color: secondaryText }]}>
        Perfil salvo localmente. Pronto para usar nas análises.
      </Text>
      <Button title="Refazer" onPress={() => setStep("intro")} />
    </View>
  );

  let content: React.ReactNode;
  if (step === "intro") content = renderIntro();
  else if (step === "green") content = renderGreen();
  else if (step === "red") content = renderRed();
  else if (step === "review") content = renderReview();
  else content = renderSave();

  return (
    <ScrollView contentContainerStyle={styles.container}>{content}</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Padding.lg,
    justifyContent: "center",
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Padding.lg,
    gap: Spacing.md,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold as any,
  },
  body: {
    fontSize: FontSize.md,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
});
