// import { DualBeamImages, useAnalysisStore } from "@/store/analysisStore"; // Importamos nossa interface
// import { useBaselineStore } from "@/store/baselineStore";
// import { Camera, CameraView, PermissionStatus } from "expo-camera";
// import { router } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Button,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// const CAPTURE_COUNT = 10;

// // Abstração para a captura de Duplo Feixe (continua a mesma)
// async function captureDualBeamImage(
//   camera: CameraView
// ): Promise<{ sampleUri: string; refUri: string }> {
//   const photo1 = await camera.takePictureAsync({ quality: 0.5 });
//   const photo2 = await camera.takePictureAsync({ quality: 0.5 });
//   if (!photo1 || !photo2) {
//     throw new Error("Falha na captura da imagem de duplo feixe.");
//   }
//   return { sampleUri: photo1.uri, refUri: photo2.uri };
// }

// export default function CaptureBaseScreen() {
//   // --- FIX 1: LÓGICA DE PERMISSÃO CORRIGIDA ---
//   const [permission, setPermission] = useState<PermissionStatus | null>(null);
//   useEffect(() => {
//     const getPermissions = async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setPermission(status);
//     };
//     getPermissions();
//   }, []);

//   const cameraRef = useRef<CameraView>(null);

//   // Estado local para controlar o fluxo da tela
//   const [stage, setStage] = useState<"dark" | "white" | "done">("dark");
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [capturedDarkImages, setCapturedDarkImages] =
//     useState<DualBeamImages | null>(null);
//   const { setupData } = useAnalysisStore();
//   const { setBaseline } = useBaselineStore();

//   const handleCapture = async () => {
//     const camera = cameraRef.current;
//     if (!camera || isCapturing) return;

//     setIsCapturing(true);
//     setProgress(0);

//     const capturedImages: DualBeamImages = {
//       sampleChannelUris: [],
//       referenceChannelUris: [],
//     };

//     try {
//       for (let i = 0; i < CAPTURE_COUNT; i++) {
//         const { sampleUri, refUri } = await captureDualBeamImage(camera);
//         capturedImages.sampleChannelUris.push(sampleUri);
//         capturedImages.referenceChannelUris.push(refUri);
//         setProgress(i + 1);
//       }

//       if (stage === "dark") {
//         setCapturedDarkImages(capturedImages); // Guarda as imagens de escuro no estado local
//         setStage("white"); // Avança para a próxima etapa
//       } else if (stage === "white" && capturedDarkImages) {
//         // Agora temos o escuro (do estado local) e o branco (da captura atual)
//         await setBaseline(capturedDarkImages, capturedImages); // Salva ambos no store persistente
//         setStage("done"); // Finaliza o processo
//       }
//     } catch (e: any) {
//       Alert.alert(
//         "Erro na Captura",
//         e.message || "Não foi possível capturar as imagens."
//       );
//     } finally {
//       setIsCapturing(false);
//       setProgress(0);
//     }
//   };

//   const handleContinue = () => {
//     if (!setupData) {
//       Alert.alert(
//         "Erro",
//         "Dados da configuração não encontrados. Retornando ao início."
//       );
//       router.push("/(tabs)/quantitative"); // Navega para a tela de setup
//       return;
//     }

//     // Agora, usamos os dados do formulário para decidir o próximo passo
//     if (setupData.hasDefinedCurve) {
//       // Se o usuário já tinha uma curva, ele está pronto para medir a amostra
//       router.push("/(tabs)/analysis/measurement-sample");
//     } else {
//       // Se ele não tinha uma curva, o próximo passo é construí-la
//       router.push("/(tabs)/analysis/CurveBuilder");
//     }
//   };

//   if (!permission) return <ActivityIndicator />;
//   if (permission !== "granted")
//     return <Text>É necessário conceder acesso à câmera.</Text>;

//   const renderContent = () => {
//     if (isCapturing) {
//       return (
//         <View style={styles.centered}>
//           <ActivityIndicator size="large" />
//           <Text style={styles.progressText}>
//             Capturando... {progress}/{CAPTURE_COUNT}
//           </Text>
//         </View>
//       );
//     }

//     switch (stage) {
//       case "dark":
//         return (
//           <View style={styles.controls}>
//             <Text style={styles.title}>Etapa 1: Medição de Escuro</Text>
//             <Text style={styles.instructions}>
//               Certifique-se de que a fonte de luz esteja **bloqueada**. Feche o
//               compartimento e pressione o botão.
//             </Text>
//             <Button title="Capturar Sinal de Escuro" onPress={handleCapture} />
//           </View>
//         );
//       case "white":
//         return (
//           <View style={styles.controls}>
//             <Text style={styles.title}>Etapa 2: Medição de Referência</Text>
//             <Text style={styles.instructions}>
//               Insira a amostra de referência (o "branco") no compartimento e
//               pressione o botão.
//             </Text>
//             <Button title="Capturar Sinal de Branco" onPress={handleCapture} />
//           </View>
//         );
//       case "done":
//         return (
//           <View style={styles.controls}>
//             <Text style={styles.title}>✅ Linha de Base Definida!</Text>
//             <Text style={styles.instructions}>
//               As medições foram salvas. Agora, prepare sua amostra para a
//               análise.
//             </Text>
//             <Button
//               title="Continuar para Medição da Amostra"
//               onPress={handleContinue}
//             />
//           </View>
//         );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={styles.camera} facing="back" />
//       <View style={styles.overlay}>{renderContent()}</View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   camera: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   controls: {
//     width: "100%",
//     padding: 20,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     alignItems: "center",
//     gap: 15,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   instructions: {
//     fontSize: 16,
//     textAlign: "center",
//     lineHeight: 24,
//     color: "#333",
//   },
//   centered: {
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 20,
//   },
//   progressText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

import { Button } from "@/src/components/ui/Button";
import { Padding, Spacing } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { DualBeamImages } from "@/src/store/analysisStore";
import { useBaselineStore } from "@/src/store/baselineStore";
import { CameraView, PermissionStatus } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

const CAPTURE_COUNT = 10;

type Stage = "dark" | "white" | "done";

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
  const card = useThemeValue("card");
  const text = useThemeValue("text");
  const secondary = useThemeValue("textSecondary");
  const primary = useThemeValue("primary");
  const bg = useThemeValue("background");

  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await (
        await import("expo-camera")
      ).Camera.requestCameraPermissionsAsync();
      setPermission(status);
    })();
  }, []);

  const cameraRef = useRef<CameraView>(null);

  const [stage, setStage] = useState<Stage>("dark");
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedDarkImages, setCapturedDarkImages] =
    useState<DualBeamImages | null>(null);
  const { setBaseline } = useBaselineStore();

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

    const capturedImages: DualBeamImages = {
      sampleChannelUris: [],
      referenceChannelUris: [],
    };

    try {
      for (let i = 0; i < CAPTURE_COUNT; i++) {
        const { sampleUri, refUri } = await captureDualBeamImage(camera);
        capturedImages.sampleChannelUris.push(sampleUri);
        capturedImages.referenceChannelUris.push(refUri);
        setProgress(i + 1);
      }

      if (stage === "dark") {
        setCapturedDarkImages(capturedImages);
        setStage("white");
      } else if (stage === "white") {
        // Se tivermos dark salvo, persiste baseline; se não, segue mesmo assim
        if (capturedDarkImages)
          await setBaseline(capturedDarkImages, capturedImages);
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

  // Fluxo livre: avançar sempre, sem travas
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
                  onPress={() => setStage("dark")}
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
