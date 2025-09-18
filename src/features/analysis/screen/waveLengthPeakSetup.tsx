import { Camera, CameraView, PermissionStatus } from "expo-camera";
import * as Crypto from "expo-crypto";
import { Plus, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "../../../../constants/Styles";
import { useThemeValue } from "../../../../hooks/useThemeValue";
import { CalibrationMeasurement } from "../../../../models/analysis";
import { useAnalysisStore } from "../../../../store/analysisStore";
import { useProfileStore } from "../../../../store/profileStore";
import TitleSection from "../../../components/common/TitleSection";
import { FormField } from "../../../components/form/FormInput";
import { ScreenLayout } from "../../../components/layouts/ScreenLayout";
import { Button } from "../../../components/ui/Button";
import { ThemedText } from "../../../components/ui/ThemedText";
import { useAnalysisFlowActions } from "../analysisFlowContext";

const CAPTURE_COUNT = 10;

// Componente para exibir um ponto de calibração já medido
const MeasurementItem = ({
  item,
  onRemove,
}: {
  item: CalibrationMeasurement;
  onRemove: (name: string) => void;
}) => {
  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const secondaryTextColor = useThemeValue("textSecondary");
  const dangerColor = useThemeValue("danger");

  return (
    <View style={[itemStyles.container, { backgroundColor: cardColor }]}>
      <View>
        <ThemedText style={[itemStyles.name, { color: textColor }]}>
          {item.laserName}
        </ThemedText>
        <ThemedText
          style={[itemStyles.wavelength, { color: secondaryTextColor }]}>
          {item.wavelengthNm} nm
        </ThemedText>
      </View>
      <TouchableOpacity onPress={() => onRemove(item.laserName)}>
        <X size={20} color={dangerColor} />
      </TouchableOpacity>
    </View>
  );
};
const itemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Padding.md,
    borderRadius: BorderRadius.md,
    marginBottom: Margin.sm,
  },
  name: { fontSize: FontSize.md, fontWeight: FontWeight.semiBold },
  wavelength: { fontSize: FontSize.sm, marginTop: Spacing.xs },
});

export default function CalibrateWavelengthScreen() {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPoint, setCurrentPoint] = useState({
    name: "",
    wavelength: "",
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const {
    addCalibrationMeasurement,
    performCalibration,
    status,
    error,
    resetAnalysis,
    calibrationMeasurements,
  } = useAnalysisStore();
  const { addProfile } = useProfileStore();
  const { completeWavelengthCalibration } = useAnalysisFlowActions();

  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const secondaryTextColor = useThemeValue("textSecondary");
  const borderColor = useThemeValue("border");

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) =>
      setPermission(status)
    );
    resetAnalysis();
  }, []);

  const handleStartCapture = () => {
    if (!currentPoint.name || !currentPoint.wavelength) {
      Alert.alert("Erro", "Preencha o nome e o comprimento de onda.");
      return;
    }
    setIsModalVisible(false);
    setShowCamera(true);
    setCurrentPoint({ name: "", wavelength: "" });
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    if (cameraRef.current == null) return;
    setIsCapturing(true);
    try {
      const uris = await Promise.all(
        Array.from({ length: CAPTURE_COUNT }).map(async () => {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.5,
          });
          return photo?.uri;
        })
      );

      const validUris = uris.filter((uri): uri is string => !!uri);
      if (validUris.length < CAPTURE_COUNT)
        throw new Error("Falha na captura de imagens.");

      addCalibrationMeasurement({
        laserName: currentPoint.name,
        wavelengthNm: parseFloat(currentPoint.wavelength),
        imageUris: validUris,
      });
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
        async (name) => {
          if (name) {
            const profileWithId = {
              ...profile,
              id: Crypto.randomUUID(),
              name,
              calibrationDate: new Date().toISOString(),
            };
            await addProfile(profileWithId);
            completeWavelengthCalibration(); // Ação do fluxo que decide a próxima tela
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
      <View style={styles.cameraContainer}>
        <Text style={styles.cameraTitle}>
          Capturando: {currentPoint.name} ({currentPoint.wavelength}nm)
        </Text>
        <CameraView
          ref={cameraRef}
          style={styles.cameraPreview}
          facing="back"
        />
        <Button
          title={
            isCapturing ? `Capturando... (${CAPTURE_COUNT} fotos)` : `Capturar`
          }
          onPress={handleCapture}
          disabled={isCapturing}
        />
        <Button
          title="Cancelar"
          onPress={() => setShowCamera(false)}
          variant="outline"
        />
      </View>
    );
  }

  return (
    <ScreenLayout>
      <TitleSection
        title="Calibrar Equipamento"
        subtitle="Adicione pontos de referência com lasers ou fontes de luz de comprimento de onda conhecido."
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
            <FormField
              label="Nome do Ponto (Ex: Laser Vermelho)"
              value={currentPoint.name}
              onChangeText={(text) =>
                setCurrentPoint((p) => ({ ...p, name: text }))
              }
            />
            <FormField
              label="Comprimento de Onda (nm)"
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
              variant="outline"
            />
          </View>
        </View>
      </Modal>

      <FlatList
        data={calibrationMeasurements}
        renderItem={({ item }) => <MeasurementItem item={item} />}
        keyExtractor={(item) => item.laserName}
        ListHeaderComponent={
          <TouchableOpacity
            style={[styles.addButton, { borderColor: secondaryTextColor }]}
            onPress={() => setIsModalVisible(true)}>
            <Plus size={20} color={textColor} />
            <ThemedText>Adicionar Ponto de Calibração</ThemedText>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            Nenhum ponto adicionado.
          </ThemedText>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />

      <View style={[styles.footer, { borderTopColor: borderColor }]}>
        {calibrationMeasurements.length < 2 && (
          <Text style={[styles.infoText, { color: secondaryTextColor }]}>
            São necessários no mínimo 2 pontos para calibrar.
          </Text>
        )}
        <Button
          title="Finalizar e Calibrar"
          onPress={handleFinishAndCalibrate}
          disabled={
            calibrationMeasurements.length < 2 || status === "calibrating"
          }
          loading={status === "calibrating"}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    padding: Padding.lg,
    backgroundColor: "#000",
    gap: Spacing.md,
  },
  cameraTitle: {
    color: "white",
    textAlign: "center",
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
  },
  cameraPreview: { flex: 1, borderRadius: BorderRadius.md },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "90%",
    padding: Padding.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Padding.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: BorderRadius.md,
    marginBottom: Margin.lg,
    gap: Spacing.sm,
  },
  emptyText: { textAlign: "center", marginTop: Margin.lg, color: "#888" },
  footer: { padding: Padding.md, borderTopWidth: 1 },
  infoText: {
    textAlign: "center",
    marginBottom: Margin.sm,
    fontSize: FontSize.sm,
  },
});
