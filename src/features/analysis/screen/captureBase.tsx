import { DualBeamImages, useAnalysisStore } from "@/store/analysisStore"; // Importamos nossa interface
import { useBaselineStore } from "@/store/baselineStore";
import { Camera, CameraView, PermissionStatus } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CAPTURE_COUNT = 10;

// Abstração para a captura de Duplo Feixe (continua a mesma)
async function captureDualBeamImage(
  camera: CameraView
): Promise<{ sampleUri: string; refUri: string }> {
  const photo1 = await camera.takePictureAsync({ quality: 0.5 });
  const photo2 = await camera.takePictureAsync({ quality: 0.5 });
  if (!photo1 || !photo2) {
    throw new Error("Falha na captura da imagem de duplo feixe.");
  }
  return { sampleUri: photo1.uri, refUri: photo2.uri };
}

export default function CaptureBaseScreen() {
  // --- FIX 1: LÓGICA DE PERMISSÃO CORRIGIDA ---
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status);
    };
    getPermissions();
  }, []);

  const cameraRef = useRef<CameraView>(null);

  // Estado local para controlar o fluxo da tela
  const [stage, setStage] = useState<"dark" | "white" | "done">("dark");
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedDarkImages, setCapturedDarkImages] =
    useState<DualBeamImages | null>(null);
  const { setupData } = useAnalysisStore();
  const { setBaseline } = useBaselineStore();

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    setProgress(0);

    const capturedImages: DualBeamImages = {
      sampleChannelUris: [],
      referenceChannelUris: [],
    };

    try {
      for (let i = 0; i < CAPTURE_COUNT; i++) {
        const { sampleUri, refUri } = await captureDualBeamImage(
          cameraRef.current
        );
        capturedImages.sampleChannelUris.push(sampleUri);
        capturedImages.referenceChannelUris.push(refUri);
        setProgress(i + 1);
      }

      if (stage === "dark") {
        setCapturedDarkImages(capturedImages); // Guarda as imagens de escuro no estado local
        setStage("white"); // Avança para a próxima etapa
      } else if (stage === "white" && capturedDarkImages) {
        // Agora temos o escuro (do estado local) e o branco (da captura atual)
        await setBaseline(capturedDarkImages, capturedImages); // Salva ambos no store persistente
        setStage("done"); // Finaliza o processo
      }
    } catch (e: any) {
      Alert.alert(
        "Erro na Captura",
        e.message || "Não foi possível capturar as imagens."
      );
    } finally {
      setIsCapturing(false);
      setProgress(0);
    }
  };

  const handleContinue = () => {
    if (!setupData) {
      Alert.alert(
        "Erro",
        "Dados da configuração não encontrados. Retornando ao início."
      );
      router.push("/(tabs)/quantitative"); // Navega para a tela de setup
      return;
    }

    // Agora, usamos os dados do formulário para decidir o próximo passo
    if (setupData.hasDefinedCurve) {
      // Se o usuário já tinha uma curva, ele está pronto para medir a amostra
      router.push("/(tabs)/analysis/measurement-sample");
    } else {
      // Se ele não tinha uma curva, o próximo passo é construí-la
      router.push("/(tabs)/analysis/CurveBuilder");
    }
  };

  if (!permission) return <ActivityIndicator />;
  if (permission !== "granted")
    return <Text>É necessário conceder acesso à câmera.</Text>;

  const renderContent = () => {
    if (isCapturing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.progressText}>
            Capturando... {progress}/{CAPTURE_COUNT}
          </Text>
        </View>
      );
    }

    switch (stage) {
      case "dark":
        return (
          <View style={styles.controls}>
            <Text style={styles.title}>Etapa 1: Medição de Escuro</Text>
            <Text style={styles.instructions}>
              Certifique-se de que a fonte de luz esteja **bloqueada**. Feche o
              compartimento e pressione o botão.
            </Text>
            <Button title="Capturar Sinal de Escuro" onPress={handleCapture} />
          </View>
        );
      case "white":
        return (
          <View style={styles.controls}>
            <Text style={styles.title}>Etapa 2: Medição de Referência</Text>
            <Text style={styles.instructions}>
              Insira a amostra de referência (o "branco") no compartimento e
              pressione o botão.
            </Text>
            <Button title="Capturar Sinal de Branco" onPress={handleCapture} />
          </View>
        );
      case "done":
        return (
          <View style={styles.controls}>
            <Text style={styles.title}>✅ Linha de Base Definida!</Text>
            <Text style={styles.instructions}>
              As medições foram salvas. Agora, prepare sua amostra para a
              análise.
            </Text>
            <Button
              title="Continuar para Medição da Amostra"
              onPress={handleContinue}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.overlay}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  controls: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#333",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
