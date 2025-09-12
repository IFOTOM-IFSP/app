import { CalibrationMeasurement } from "@/models/analysis";
import { useAnalysisStore } from "@/store/analysisStore";
import { useBaselineStore } from "@/store/baselineStore";
import { useProfileStore } from "@/store/profileStore";
import { Camera, CameraView, PermissionStatus } from "expo-camera";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CAPTURE_COUNT = 10;

export default function WaveLengthPeakSetupScreen() {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);

  const cameraRef = useRef<CameraView>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<{
    name: string;
    wavelength: string;
  }>({ name: "", wavelength: "" });
  const [completedMeasurements, setCompletedMeasurements] = useState<
    CalibrationMeasurement[]
  >([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const {
    addCalibrationMeasurement,
    performCalibration,
    status,
    error,
    setupData,
    resetAnalysis,
  } = useAnalysisStore();
  const { addProfile } = useProfileStore();
  const { darkSignalImages, whiteSignalImages } = useBaselineStore();

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status);
    };
    getPermissions();
    resetAnalysis();
  }, []);

  const handleStartDefiningPoint = () => {
    setCurrentPoint({ name: "", wavelength: "" });
    setIsModalVisible(true);
  };

  const handleStartCapture = () => {
    if (!currentPoint.name || !currentPoint.wavelength) {
      Alert.alert(
        "Erro",
        "Por favor, preencha o nome e o comprimento de onda."
      );
      return;
    }
    setIsModalVisible(false);
    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    const uris: string[] = [];
    try {
      for (let i = 0; i < CAPTURE_COUNT; i++) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
        if (photo) uris.push(photo.uri);
      }

      const newMeasurement: CalibrationMeasurement = {
        laserName: currentPoint.name,
        wavelengthNm: parseFloat(currentPoint.wavelength),
        imageUris: uris,
      };

      setCompletedMeasurements([...completedMeasurements, newMeasurement]);
      addCalibrationMeasurement(newMeasurement);

      setShowCamera(false);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível capturar as imagens.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFinishAndCalibrate = async () => {
    const profile = await performCalibration();
    if (profile) {
      Alert.prompt(
        "Calibração Concluída!",
        "Dê um nome para salvar este novo perfil:",
        (name) => {
          if (name) {
            const profileWithId = {
              ...profile,
              id: Crypto.randomUUID(),
              name,
              calibrationDate: new Date().toISOString(),
            };
            addProfile(profileWithId);
            if (!setupData) {
              Alert.alert(
                "Erro",
                "Não foi possível encontrar os dados da análise. Voltando ao início."
              );
              router.push("/(tabs)/quantitative");
              return;
            }
            if (!setupData.hasDefinedCurve) {
              router.push("/(tabs)/analysis/CurveBuilder");
            } else {
              if (darkSignalImages && whiteSignalImages) {
                Alert.alert(
                  "Linha de Base Existente",
                  "Encontramos medições de escuro e branco salvas. Deseja usá-las ou medir novamente?",
                  [
                    {
                      text: "Usar Existente",
                      onPress: () =>
                        router.push("/(tabs)/analysis/measurement-sample"),
                    },
                    {
                      text: "Medir Novamente",
                      onPress: () =>
                        router.push("/(tabs)/analysis/capture-base"),
                    },
                  ]
                );
              } else {
                router.push("/(tabs)/analysis/capture-base");
              }
            }
          }
        },
        "plain-text",
        `Perfil ${new Date().toLocaleDateString("pt-BR")}`
      );
    } else {
      Alert.alert(
        "Falha na Calibração",
        `Erro: ${error || "Tente novamente."}`
      );
    }
  };

  if (!permission) return <ActivityIndicator />;
  if (permission !== "granted")
    return <Text>Você precisa conceder acesso à câmera.</Text>;

  if (showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Capturando: {currentPoint.name} ({currentPoint.wavelength}nm)
        </Text>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <Button
          title={
            isCapturing ? `Capturando...` : `Capturar (${CAPTURE_COUNT} fotos)`
          }
          onPress={handleCapture}
          disabled={isCapturing}
        />
        <Button
          title="Cancelar Captura"
          onPress={() => setShowCamera(false)}
          color="red"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Ponto de Calibração</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Ponto (ex: Laser Vermelho)"
              value={currentPoint.name}
              onChangeText={(text) =>
                setCurrentPoint((p) => ({ ...p, name: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Comprimento de Onda (nm)"
              value={currentPoint.wavelength}
              onChangeText={(text) =>
                setCurrentPoint((p) => ({ ...p, wavelength: text }))
              }
              keyboardType="numeric"
            />
            <Button title="Iniciar Captura" onPress={handleStartCapture} />
            <Button
              title="Cancelar"
              onPress={() => setIsModalVisible(false)}
              color="gray"
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Calibração do Equipamento</Text>
      <View style={styles.listContainer}>
        {completedMeasurements.length === 0 && (
          <Text style={styles.placeholderText}>
            Nenhum ponto de calibração adicionado.
          </Text>
        )}
        {completedMeasurements.map((m, index) => (
          <Text key={index} style={styles.listItem}>
            ✅ {m.laserName} ({m.wavelengthNm}nm)
          </Text>
        ))}
      </View>

      <Button
        title="Adicionar Ponto de Calibração"
        onPress={handleStartDefiningPoint}
      />

      {status === "calibrating" ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Finalizar e Calibrar"
            onPress={handleFinishAndCalibrate}
            disabled={completedMeasurements.length < 2}
          />
        </View>
      )}
      {completedMeasurements.length < 2 && (
        <Text style={styles.infoText}>
          São necessários no mínimo 2 pontos para calibrar.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", gap: 15 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  camera: { flex: 1, borderRadius: 8 },
  listContainer: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  listItem: { fontSize: 16, paddingVertical: 4 },
  placeholderText: { fontSize: 16, color: "#888", textAlign: "center" },
  infoText: { fontSize: 12, color: "#666", textAlign: "center", marginTop: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
});
