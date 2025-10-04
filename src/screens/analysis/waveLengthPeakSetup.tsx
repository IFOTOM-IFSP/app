// src/features/analysis/screen/waveLengthPeakSetup.tsx
import { Camera, CameraView } from "expo-camera";
import * as Crypto from "expo-crypto";
import { Info, Plus, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CalibrationMeasurement } from "@/src/models/analysis";
import { useAnalysisStore } from "@/src/store/deviceProfileStore";
import { useProfileStore } from "@/src/store/profileLibraryStore.ts";
import { FormField } from "../../components/form/FormInput";
import { ScreenLayout } from "../../components/layouts/ScreenLayout";
import BackButton from "../../components/ui/BackButton";
import { Button } from "../../components/ui/Button";
import { InfoModal } from "../../components/ui/InfoModal";
import { ThemedText } from "../../components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "../../constants/Styles";
import { useAnalysisMachine } from "../../hooks/AnalysisMachineProvider";
import { useThemeValue } from "../../hooks/useThemeValue";

// quantos frames/fotos capturar por ponto
const CAPTURE_COUNT = 10;

/** Card compacto de ponto de calibração já medido */
const MeasurementItem = ({
  item,
  onRemove,
}: {
  item: CalibrationMeasurement;
  onRemove?: (name: string) => void;
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
      {!!onRemove && (
        <TouchableOpacity onPress={() => onRemove(item.laserName)}>
          <X size={20} color={dangerColor} />
        </TouchableOpacity>
      )}
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
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const cameraRef = useRef<CameraView>(null);

  // modais
  const [isAddPointModalVisible, setAddPointModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isSaveProfileModalVisible, setSaveProfileModalVisible] =
    useState(false);

  // formulário de ponto atual
  const [currentPoint, setCurrentPoint] = useState({
    name: "",
    wavelength: "",
  });

  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [saveProfileName, setSaveProfileName] = useState<string>("");

  // stores
  const {
    addCalibrationMeasurement,
    removeCalibrationMeasurement, // se não existir no store, pode ignorar
    performCalibration,
    status,
    error,
    resetAnalysis,
    calibrationMeasurements,
  } = useAnalysisStore();

  const { addProfile } = useProfileStore();

  // XState machine
  const { send } = useAnalysisMachine();

  // theming
  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const secondaryTextColor = useThemeValue("textSecondary");
  const borderColor = useThemeValue("border");
  const tintColor = useThemeValue("tint");
  const primaryColor = useThemeValue("primary");

  // permissões e reset local de estado de calibração
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermissionStatus(status);
    })();
    resetAnalysis();
  }, [resetAnalysis]);

  // --- Ações ---

  const handleStartCapture = () => {
    if (!currentPoint.name || !currentPoint.wavelength) {
      Alert.alert("Erro", "Preencha o nome e o comprimento de onda.");
      return;
    }
    setAddPointModalVisible(false);
    setShowCamera(true);
    // NÃO limpar o estado aqui; faremos após salvar a captura
  };

  const handleCapture = async () => {
    const camera = cameraRef.current;
    if (!camera || isCapturing) return;

    setIsCapturing(true);
    try {
      const uris = await Promise.all(
        Array.from({ length: CAPTURE_COUNT }).map(async () => {
          const photo = await camera.takePictureAsync({ quality: 0.5 });
          return photo?.uri;
        })
      );

      const validUris = uris.filter((uri): uri is string => !!uri);
      if (validUris.length < CAPTURE_COUNT) {
        throw new Error("Falha na captura de imagens.");
      }

      addCalibrationMeasurement({
        laserName: currentPoint.name,
        wavelengthNm: parseFloat(currentPoint.wavelength),
        imageUris: validUris,
      });

      // limpeza e volta para a tela
      setShowCamera(false);
      setCurrentPoint({ name: "", wavelength: "" });
    } catch (_err) {
      Alert.alert("Erro", "Não foi possível capturar as imagens.");
    } finally {
      setIsCapturing(false);
    }
  };

  // finaliza, calcula coeficientes e abre modal para nomear/salvar
  const handleFinishAndCalibrate = async () => {
    const profile = await performCalibration();
    if (!profile) {
      Alert.alert(
        "Falha na Calibração",
        `Erro: ${error || "Tente novamente."}`
      );
      return;
    }
    setSaveProfileName(`Perfil ${new Date().toLocaleDateString("pt-BR")}`);
    setSaveProfileModalVisible(true);
  };

  // confirma salvar perfil, adiciona na biblioteca e avança o fluxo na XState
  const confirmSaveProfile = async () => {
    setSaveProfileModalVisible(false);

    const profile = await performCalibration();
    if (!profile) {
      Alert.alert(
        "Falha na Calibração",
        `Erro: ${error || "Tente novamente."}`
      );
      return;
    }

    // (1) Salvar na biblioteca de perfis para o usuário
    const libProfile = {
      ...profile,
      id: Crypto.randomUUID(),
      name:
        (saveProfileName || "").trim() ||
        `Perfil ${new Date().toLocaleDateString("pt-BR")}`,
      calibrationDate: new Date().toISOString(),
    };
    await addProfile(libProfile);

    // (2) Entregar o perfil (cru, no formato DeviceProfile) para a máquina
    send({ type: "DEVICE_PROFILE_READY", profile });
  };

  // --- Render ---

  if (permissionStatus === "undetermined") {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }
  if (permissionStatus !== "granted") {
    return <Text>Você precisa conceder acesso à câmera.</Text>;
  }

  // UI de captura
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <Text style={styles.cameraTitle}>
          Capturando: {currentPoint.name} ({currentPoint.wavelength} nm)
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

  const handleCloseInfoModal = () => setIsInfoModalVisible(false);

  return (
    <ScreenLayout>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <BackButton color={textColor} style={styles.baseContainer} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tintColor }]}>
            <Text style={styles.stepBadgeText}>3</Text>
          </View>
          <ThemedText style={[styles.headerTitle, { color: textColor }]}>
            Calibrar Equipamento
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setIsInfoModalVisible(true)}>
          <Info size={22} color={secondaryTextColor} />
        </TouchableOpacity>
      </View>

      {/* Texto de apoio */}
      <ThemedText style={[styles.instructions, { color: secondaryTextColor }]}>
        Registre pelo menos dois pontos de referência capturando o feixe de
        lasers ou fontes com comprimentos de onda conhecidos.
      </ThemedText>

      {/* Modal de ajuda (didático) */}
      <InfoModal
        visible={isInfoModalVisible}
        onClose={handleCloseInfoModal}
        title="Calibração do equipamento"
        icon={<Info size={40} color={primaryColor} />}
        content={
          "Nesta etapa, calibramos o espectrofotômetro usando fontes de comprimento de onda conhecido. Esses pontos garantem que as leituras de λ estejam alinhadas antes de medir as amostras."
        }
        actions={
          <Button
            title="Entendi"
            onPress={handleCloseInfoModal}
            style={styles.modalActionButton}
          />
        }
      />

      {/* Modal para adicionar ponto */}
      <Modal
        visible={isAddPointModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddPointModalVisible(false)}>
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
              onPress={() => setAddPointModalVisible(false)}
              variant="outline"
            />
          </View>
        </View>
      </Modal>

      {/* Modal para nomear/salvar perfil */}
      <Modal
        visible={isSaveProfileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSaveProfileModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
            <ThemedText style={{ fontSize: FontSize.lg, marginBottom: 8 }}>
              Salvar perfil de calibração
            </ThemedText>
            <TextInput
              value={saveProfileName}
              onChangeText={setSaveProfileName}
              placeholder="Nome do perfil"
              style={{
                borderWidth: 1,
                borderColor: borderColor,
                borderRadius: BorderRadius.md,
                padding: 12,
                marginBottom: 12,
                color: textColor,
              }}
              placeholderTextColor={secondaryTextColor}
            />
            <Button title="Salvar e continuar" onPress={confirmSaveProfile} />
            <Button
              title="Cancelar"
              onPress={() => setSaveProfileModalVisible(false)}
              variant="outline"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>

      {/* Lista de pontos adicionados */}
      <View style={styles.listContainer}>
        <FlatList
          data={calibrationMeasurements}
          renderItem={({ item }) => (
            <MeasurementItem
              item={item}
              onRemove={
                typeof removeCalibrationMeasurement === "function"
                  ? (name) => removeCalibrationMeasurement(name)
                  : undefined
              }
            />
          )}
          keyExtractor={(item) => item.laserName}
          ListHeaderComponent={
            <TouchableOpacity
              style={[styles.addButton, { borderColor: secondaryTextColor }]}
              onPress={() => setAddPointModalVisible(true)}>
              <Plus size={20} color={textColor} />
              <ThemedText>Adicionar Ponto de Calibração</ThemedText>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <ThemedText
              style={[styles.emptyText, { color: secondaryTextColor }]}>
              Nenhum ponto adicionado.
            </ThemedText>
          }
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Rodapé */}
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
    padding: 16,
  },
  modalContent: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    padding: Padding.lg,
    gap: Spacing.md,
  },
  modalActionButton: { marginTop: Margin.md },
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
  footer: {
    paddingTop: Padding.md,
    paddingBottom: Padding.lg,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  infoText: {
    textAlign: "center",
    marginBottom: Margin.sm,
    fontSize: FontSize.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Margin.lg,
    width: "100%",
  },
  baseContainer: { padding: 0, backgroundColor: "transparent" },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepBadgeText: { color: "white", fontWeight: "bold", fontSize: 16 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.semiBold },
  infoButton: { padding: Spacing.xs },
  instructions: {
    fontSize: FontSize.md,
    lineHeight: 22,
    marginBottom: Margin.lg,
  },
  listContainer: { flex: 1 },
  list: { flex: 1 },
  listContent: { flexGrow: 1, paddingBottom: Padding.lg },
});
