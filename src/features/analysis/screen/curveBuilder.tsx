import { Camera, CameraView, PermissionStatus } from "expo-camera";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

// Importando todos os stores necessários
import { DualBeamImages, useAnalysisStore } from "@/src/store/analysisStore";
import { useBaselineStore } from "@/src/store/baselineStore";
import { useCurveStore } from "@/src/store/curveLibraryStore.ts";
import { useProfileStore } from "@/src/store/profileLibraryStore.ts";

const CAPTURE_COUNT = 10;

// Abstração para a captura de Duplo Feixe
async function captureDualBeamImage(
  camera: CameraView
): Promise<DualBeamImages> {
  const sampleChannelUris: string[] = [];
  const referenceChannelUris: string[] = [];

  for (let i = 0; i < CAPTURE_COUNT; i++) {
    // --- SIMULAÇÃO ---
    // No hardware real, esta seria uma única chamada ao SDK que retorna duas imagens.
    const photo1 = await camera.takePictureAsync({ quality: 0.5 });
    const photo2 = await camera.takePictureAsync({ quality: 0.5 });

    if (!photo1 || !photo2) {
      throw new Error("Falha na captura da imagem de duplo feixe.");
    }
    sampleChannelUris.push(photo1.uri);
    referenceChannelUris.push(photo2.uri);
  }
  return { sampleChannelUris, referenceChannelUris };
}

export default function CurveBuilderScreen() {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // States locais para UI
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentConcentration, setCurrentConcentration] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Conexão com os stores
  const {
    setupData,
    standardPoints,
    status,
    calculateAbsorbanceForStandard,
    fitCurve,
    newlyCreatedCurve,
  } = useAnalysisStore();
  const { darkSignalImages, whiteSignalImages } = useBaselineStore();
  const { profiles } = useProfileStore();
  const { addCurve } = useCurveStore();

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status);
    };
    getPermissions();
  }, []);

  const handleStartCapture = () => {
    if (!currentConcentration || isNaN(parseFloat(currentConcentration))) {
      Alert.alert(
        "Entrada Inválida",
        "Por favor, insira um valor numérico para a concentração."
      );
      return;
    }
    setIsModalVisible(false);
    setShowCamera(true);
  };

  const handleCaptureStandard = async () => {
    // Validações para garantir que todos os dados necessários estão presentes
    const camera = cameraRef.current;
    if (!camera || !setupData || !darkSignalImages || !whiteSignalImages) {
      Alert.alert(
        "Erro de Dados",
        "Dados essenciais da análise (setup, linha de base) não foram encontrados."
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

    setIsCapturing(true);
    try {
      const sampleImages = await captureDualBeamImage(camera);
      // Chama a ação no store, que cuidará da chamada à API
      await calculateAbsorbanceForStandard({
        concentration: parseFloat(currentConcentration),
        sampleImages,
        baseline: { dark: darkSignalImages, white: whiteSignalImages },
        profile,
        wavelength: setupData.wavelength,
      });
    } catch (e: any) {
      Alert.alert(
        "Erro de Captura",
        e.message || "Falha na captura ou cálculo da absorbância."
      );
    } finally {
      setIsCapturing(false);
      setShowCamera(false);
      setCurrentConcentration(""); // Limpa o campo para o próximo padrão
    }
  };

  const handleFinishCurve = async () => {
    await fitCurve();
  };

  // useEffect para reagir à criação da curva
  useEffect(() => {
    if (status === "success" && newlyCreatedCurve && setupData) {
      Alert.prompt(
        "Curva Criada com Sucesso!",
        `Ajuste R² = ${newlyCreatedCurve.r_squared.toFixed(
          4
        )}. Dê um nome para salvar esta curva:`,
        (name) => {
          if (name) {
            const newCurve = {
              id: Crypto.randomUUID(),
              substanceName: `${setupData.substance} - ${name}`,
              wavelengthNm: setupData.wavelength,
              creationDate: new Date().toISOString(),
              coefficients: newlyCreatedCurve,
            };
            addCurve(newCurve); // Salva a curva permanentemente
            router.push("/(tabs)/analysis/measurement-sample");
          }
        },
        "plain-text",
        `Curva Padrão ${new Date().toLocaleDateString("pt-BR")}`
      );
    } else if (status === "error") {
      Alert.alert("Erro", "Não foi possível gerar a curva de calibração.");
    }
  }, [status, newlyCreatedCurve]);

  if (!permission) return <ActivityIndicator />;
  if (permission !== "granted")
    return <Text>Você precisa conceder acesso à câmera.</Text>;

  if (showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Padrão: {currentConcentration}</Text>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <Button
          title={
            isCapturing
              ? `Capturando...`
              : `Capturar Padrão (${CAPTURE_COUNT} fotos)`
          }
          onPress={handleCaptureStandard}
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
            <Text style={styles.modalTitle}>Adicionar Padrão</Text>
            <TextInput
              style={styles.input}
              placeholder="Concentração conhecida do padrão"
              value={currentConcentration}
              onChangeText={setCurrentConcentration}
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

      <Text style={styles.title}>Construção da Curva de Calibração</Text>
      <Text style={styles.subtitle}>
        Substância: {setupData?.substance} @ {setupData?.wavelength}nm
      </Text>

      <View style={styles.listContainer}>
        {standardPoints.length === 0 && (
          <Text style={styles.placeholderText}>
            Nenhum padrão medido ainda.
          </Text>
        )}
        {standardPoints.map((p, index) => (
          <Text key={index} style={styles.listItem}>
            ✅ Ponto {index + 1}: Concentração = {p.concentration.toFixed(3)},
            Absorbância = {p.absorbance.toFixed(3)}
          </Text>
        ))}
        {status === "processing" && (
          <ActivityIndicator style={{ marginTop: 10 }} />
        )}
      </View>

      <Button
        title="Adicionar Ponto Padrão"
        onPress={() => setIsModalVisible(true)}
      />

      {status === "fitting_curve" ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Finalizar e Gerar Curva"
            onPress={handleFinishCurve}
            disabled={standardPoints.length < 2 || status === "processing"}
          />
        </View>
      )}
      {standardPoints.length < 2 && (
        <Text style={styles.infoText}>
          São necessários no mínimo 2 pontos para gerar a curva.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", gap: 15 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 10,
  },
  camera: { flex: 1, borderRadius: 8 },
  listContainer: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  listItem: { fontSize: 16, paddingVertical: 4 },
  placeholderText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    paddingTop: 20,
  },
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
