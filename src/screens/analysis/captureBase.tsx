// app/(tabs)/analysis/create/capture-base.tsx
import { Button } from "@/src/components/ui/Button";
import { Padding, Spacing } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, PermissionStatus } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

const CAPTURE_COUNT = 10;
const BASELINE_DUAL_KEY = "@ifotom/baseline_dual";

type Stage = "dark" | "white" | "done";

/** Burst com dois canais (amostra/referência) para baseline dual-beam */
type DualChannelBurst = {
  sampleChannelUris: string[];
  referenceChannelUris: string[];
};

type BaselineDualPayload = {
  dark: DualChannelBurst;
  white: DualChannelBurst;
  ts: number;
};

// Persistência local do baseline (dual-beam)
async function persistBaselineDual(
  dark: DualChannelBurst,
  white: DualChannelBurst
) {
  const payload: BaselineDualPayload = { dark, white, ts: Date.now() };
  await AsyncStorage.setItem(BASELINE_DUAL_KEY, JSON.stringify(payload));
}

// Captura sequencial de duas fotos (amostra e referência)
async function captureDualBeamImage(
  camera: CameraView
): Promise<{ sampleUri: string; refUri: string }> {
  const photo1 = await camera.takePictureAsync({ quality: 0.5 });
  const photo2 = await camera.takePictureAsync({ quality: 0.5 });
  if (!photo1 || !photo2)
    throw new Error("Falha na captura da imagem de duplo feixe.");
  return { sampleUri: (photo1 as any).uri, refUri: (photo2 as any).uri };
}

export default function CaptureBaseScreen() {
  // tema
  const card = useThemeValue("card");
  const text = useThemeValue("text");
  const secondary = useThemeValue("textSecondary");
  const primary = useThemeValue("primary");
  const bg = useThemeValue("background");

  // permissões
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  useEffect(() => {
    (async () => {
      const { Camera } = await import("expo-camera");
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status);
    })();
  }, []);

  const cameraRef = useRef<CameraView>(null);

  // fluxo/estado
  const [stage, setStage] = useState<Stage>("dark");
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);

  // guardamos o burst DARK para, depois, salvar com o WHITE
  const [capturedDark, setCapturedDark] = useState<DualChannelBurst | null>(
    null
  );

  const stageIndex = stage === "dark" ? 1 : stage === "white" ? 2 : 3;
  const stageTitle =
    stage === "dark"
      ? "Etapa 1: Medição de Escuro"
      : stage === "white"
      ? "Etapa 2: Medição de Referência"
      : "✅ Linha de Base Definida";
  const stageHint =
    stage === "dark"
      ? "Bloqueie a luz. Feche o compartimento e capture."
      : stage === "white"
      ? "Insira o branco (referência) e capture."
      : "As medições foram salvas. Prepare sua amostra.";

  const handleCapture = async () => {
    const camera = cameraRef.current;
    if (!camera || isCapturing) return;

    setIsCapturing(true);
    setProgress(0);

    const burst: DualChannelBurst = {
      sampleChannelUris: [],
      referenceChannelUris: [],
    };

    try {
      for (let i = 0; i < CAPTURE_COUNT; i++) {
        const { sampleUri, refUri } = await captureDualBeamImage(camera);
        burst.sampleChannelUris.push(sampleUri);
        burst.referenceChannelUris.push(refUri);
        setProgress(i + 1);
      }

      if (stage === "dark") {
        setCapturedDark(burst); // guarda DARK
        setStage("white");
      } else if (stage === "white") {
        // salva baseline (DARK + WHITE) no AsyncStorage
        if (capturedDark) {
          await persistBaselineDual(capturedDark, burst);
        } else {
          // fallback: salva white com dark vazio
          await persistBaselineDual(
            { sampleChannelUris: [], referenceChannelUris: [] },
            burst
          );
        }
        setStage("done");
      }
    } catch (e: any) {
      Alert.alert(
        "Erro na Captura",
        e?.message || "Não foi possível capturar as imagens."
      );
    } finally {
      setIsCapturing(false);
      setProgress(0);
    }
  };

  // fluxo livre: avançar sempre, sem travas
  const advanceStage = () =>
    setStage((s) => (s === "dark" ? "white" : s === "white" ? "done" : "done"));

  const handleNext = () => {
    if (stage !== "done") advanceStage();
    else router.push("/(tabs)/analysis/measurement-sample");
  };

  if (!permission) return <ActivityIndicator style={{ flex: 1 }} />;
  if (permission !== "granted")
    return (
      <Text style={{ padding: 16 }}>
        É necessário conceder acesso à câmera.
      </Text>
    );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Card superior com etapa */}
        <View style={[styles.card, { backgroundColor: card }]}>
          <View style={styles.stepRow}>
            <View style={[styles.badge, { backgroundColor: primary }]}>
              <Text style={styles.badgeText}>{stageIndex}/3</Text>
            </View>
            <Text style={[styles.title, { color: text }]}>{stageTitle}</Text>
          </View>

          <Text style={[styles.instructions, { color: secondary }]}>
            {stageHint}
          </Text>

          {isCapturing ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" />
              <Text style={[styles.progressText, { color: text }]}>
                Capturando... {progress}/{CAPTURE_COUNT}
              </Text>
              {/* Barra de progresso simples */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(progress / CAPTURE_COUNT) * 100}%`,
                      backgroundColor: primary,
                    },
                  ]}
                />
              </View>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              {stage !== "done" ? (
                <Button
                  title={
                    stage === "dark" ? "Capturar Escuro" : "Capturar Branco"
                  }
                  onPress={handleCapture}
                />
              ) : (
                <Button
                  title="Refazer Capturas"
                  variant="outline"
                  onPress={() => {
                    setCapturedDark(null);
                    setStage("dark");
                  }}
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {stage !== "done" && (
            <Button
              title="Pular etapa"
              variant="outline"
              onPress={advanceStage}
            />
          )}
          <Button
            title={stage === "done" ? "Próximo" : "Avançar"}
            onPress={handleNext}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    padding: Padding.md,
  },
  card: {
    padding: Padding.md,
    borderRadius: 12,
    gap: Spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontWeight: "700" },
  title: { fontSize: 20, fontWeight: "700" },
  instructions: { fontSize: 16, lineHeight: 22 },
  centered: { alignItems: "center", gap: 10 },
  progressText: { fontSize: 16, fontWeight: "600" },
  progressBarBg: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#00000020",
  },
  progressBarFill: { height: 8, borderRadius: 999 },
  actionsRow: { flexDirection: "row", gap: 8 },
  footer: {
    height: 300,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 200,
  },
});
