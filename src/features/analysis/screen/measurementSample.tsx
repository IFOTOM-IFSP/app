import { Camera, CameraView, PermissionStatus } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Importando todos os stores necessários
import { CalibrationCurve } from "@/models/CalibrationCurve";
import captureDualBeamImage from "@/src/components/captureDualBeamImage";
import { useAnalysisStore } from "@/store/analysisStore";
import { useBaselineStore } from "@/store/baselineStore";
import { useProfileStore } from "@/store/profileStore";

export default function MeasurementSampleScreen() {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const [isCapturing, setIsCapturing] = useState(false);

  // Conexão com os stores
  const {
    setupData,
    status,
    finalResult,
    calculateFinalConcentration,
    newlyCreatedCurve,
  } = useAnalysisStore();
  const { darkSignalImages, whiteSignalImages } = useBaselineStore();
  const { profiles } = useProfileStore();

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status);
    };
    getPermissions();
  }, []);

  // Efeito para navegar para a tela de resultados quando o cálculo terminar
  useEffect(() => {
    if (status === "success" && finalResult) {
      // router.push('/(tabs)/analysis/results');
      Alert.alert(
        "Análise Concluída!",
        `Concentração encontrada: ${finalResult.final_concentration.toFixed(4)}`
      );
    } else if (status === "error") {
      Alert.alert("Erro", "Não foi possível processar a análise final.");
    }
  }, [status, finalResult]);

  const handleAnalyze = async () => {
    // --- 1. Validação e Coleta de Dados ---
    const camera = cameraRef.current;
    if (
      !camera ||
      !setupData ||
      !darkSignalImages ||
      !whiteSignalImages
    ) {
      Alert.alert(
        "Erro de Dados",
        "Dados essenciais (setup, linha de base) não foram encontrados."
      );
      return;
    }
    const profile = profiles.find((p) => p.id === setupData.selectedProfileId);
    if (!profile) {
      Alert.alert(
        "Erro de Perfil",
        "O perfil do equipamento selecionado não foi encontrado."
      );
      return;
    }

    // Lógica para encontrar a curva correta
    let curve: CalibrationCurve["coefficients"] | null = null;
    if (newlyCreatedCurve) {
      // Prioridade 1: A curva que acabamos de criar no CurveBuilder
      curve = newlyCreatedCurve;
    } else if (
      setupData.hasDefinedCurve &&
      setupData.slope_m != null &&
      setupData.intercept_b != null
    ) {
      curve = {
        slope_m: setupData.slope_m,
        intercept_b: setupData.intercept_b,
        r_squared: 0,
      };
    }

    if (!curve) {
      Alert.alert(
        "Erro de Curva",
        "Não foi possível encontrar uma curva de calibração válida para a análise."
      );
      return;
    }

    setIsCapturing(true);
    try {
      const sampleImages = await captureDualBeamImage(camera);

      await calculateFinalConcentration({
        sampleImages,
        baseline: { dark: darkSignalImages, white: whiteSignalImages },
        profile,
        curve,
        wavelength: setupData.wavelength,
      });
    } catch (e: any) {
      Alert.alert("Erro de Captura", e.message || "Falha ao medir a amostra.");
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) return <ActivityIndicator />;
  if (permission !== "granted")
    return <Text>É necessário conceder acesso à câmera.</Text>;

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        {status === "processing" ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text style={styles.progressText}>
              Processando resultado final...
            </Text>
          </View>
        ) : (
          <View style={styles.controls}>
            <Text style={styles.title}>Medição da Amostra</Text>
            <Text style={styles.instructions}>
              Insira sua amostra de concentração desconhecida no compartimento e
              pressione o botão abaixo para iniciar a análise final.
            </Text>
            <Button
              title="Analisar Amostra"
              onPress={handleAnalyze}
              disabled={isCapturing}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { ...StyleSheet.absoluteFillObject },
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
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#333",
  },
  centered: { justifyContent: "center", alignItems: "center", gap: 20 },
  progressText: { fontSize: 18, fontWeight: "bold" },
});
