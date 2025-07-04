// Localização: src/app/analysis/calibration.tsx

import { useAnalysisActions, useAnalysisStore } from "@/state/analysisStore";
import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Beaker,
  Bot,
  Camera,
  CheckCircle,
  FlaskConical,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Componentes, Ícones e Tipos
import BackButton from "@/components/ui/BackButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { SampleData } from "@/interfaces/analysis";

// --- Constantes e Tipos ---
const NUM_FRAMES_TO_CAPTURE = 10;
type UIState = "idle" | "adding" | "capturing";

// --- Sub-componente: Modal de Captura (Ecrã Inteiro) ---
const StandardCaptureModal = ({
  isVisible,
  concentration,
  unit,
  onComplete,
  onCancel,
}: {
  isVisible: boolean;
  concentration: number;
  unit: string;
  onComplete: (uris: string[]) => void;
  onCancel: () => void;
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedUris, setCapturedUris] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCapturedUris([]);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const handleCapture = async () => {
    if (isCapturing || !cameraRef.current) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        const newUris = [...capturedUris, photo.uri];
        setCapturedUris(newUris);
        if (newUris.length >= NUM_FRAMES_TO_CAPTURE) {
          onComplete(newUris);
        }
      }
    } catch (error) {
      console.error("Erro de Câmera", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const renderContent = () => {
    if (!permission) {
      return <ActivityIndicator style={StyleSheet.absoluteFill} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <ThemedText style={styles.permissionText}>
            É necessária permissão para usar a câmera.
          </ThemedText>
          <PrimaryButton
            title="Conceder Permissão"
            onPress={requestPermission}
          />
        </View>
      );
    }

    // CORRIGIDO: A CameraView e o Overlay são agora irmãos para evitar o aviso.
    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraView
          style={StyleSheet.absoluteFill}
          ref={cameraRef}
          facing="back"
        />
        <View style={styles.captureOverlay}>
          <View style={styles.captureHeader}>
            <ThemedText style={styles.captureTitle}>
              Padrão: {concentration} {unit}
            </ThemedText>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.captureFooter}>
            <ThemedText style={styles.progressText}>
              {capturedUris.length} / {NUM_FRAMES_TO_CAPTURE}
            </ThemedText>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={handleCapture}
              disabled={isCapturing}
              accessibilityLabel={`Capturar imagem ${
                capturedUris.length + 1
              } de ${NUM_FRAMES_TO_CAPTURE}`}>
              {isCapturing ? (
                <ActivityIndicator color="black" />
              ) : (
                <Camera size={32} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {renderContent()}
      </View>
    </Modal>
  );
};

// --- Tela Principal de Calibração Refatorada ---
export default function CalibrationScreen() {
  const router = useRouter();
  const store = useAnalysisStore();
  const actions = useAnalysisActions();
  const { setup, result, samples } = store.sessionData;
  const insets = useSafeAreaInsets();

  const [uiState, setUiState] = useState<UIState>("idle");
  const [concentration, setConcentration] = useState("");
  const [standardToRemove, setStandardToRemove] = useState<string | null>(null);

  const capturedStandards = useMemo(
    () => samples.filter((s) => s.type === "standard"),
    [samples]
  );

  useFocusEffect(
    useCallback(() => {
      setUiState("idle");
      if (store.currentStep === "sample_capture") {
        router.replace("/analysis/capture-samples");
      }
    }, [store.currentStep, router])
  );

  const handleStartCapture = () => {
    Keyboard.dismiss();
    const concValue = parseFloat(concentration);
    if (isNaN(concValue) || concValue < 0) {
      actions.showUiNotification({
        title: "Valor Inválido",
        message: "Por favor, insira uma concentração numérica válida.",
        type: "error",
      });
      return;
    }
    setUiState("capturing");
  };

  const handleCaptureComplete = (uris: string[]) => {
    // CORRIGIDO: Gerar um ID único sem usar 'crypto' para ser compatível com Hermes.
    const newId = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
    const newStandard: SampleData = {
      id: newId,
      type: "standard",
      concentration: parseFloat(concentration),
      uris,
    };
    actions.addCapturedSample(newStandard);
    setConcentration("");
    setUiState("idle");
  };

  const handleRemoveConfirm = () => {
    if (standardToRemove !== null) {
      actions.removeCapturedSample(standardToRemove);
    }
    setStandardToRemove(null);
  };

  const isCalculatingCurve = store.currentStep === "processing_curve";
  const isCurveCalculated = !!result?.calibration_curve;

  // CORRIGIDO: As cores são obtidas a partir do hook do tema.
  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const borderColor = useThemeValue("border");
  const accentColor = useThemeValue("primary");
  const dangerColor = useThemeValue("warning");
  const backgroundColor = useThemeValue("background");
  const textSecondaryColor = useThemeValue("textSecondary");

  return (
    <ThemedView style={styles.container}>
      {/* Modais */}
      <StandardCaptureModal
        isVisible={uiState === "capturing"}
        onCancel={() => setUiState("idle")}
        onComplete={handleCaptureComplete}
        concentration={parseFloat(concentration)}
        unit={setup?.unit || ""}
      />

      <Modal visible={uiState === "adding"} transparent={true}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={() => setUiState("idle")}
          activeOpacity={1}>
          <BlurView
            intensity={10}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </TouchableOpacity>
        <View style={styles.modalInputContainer}>
          <View
            style={[styles.modalInputContent, { backgroundColor: cardColor }]}>
            <ThemedText style={styles.modalTitle}>Novo Padrão</ThemedText>
            <ThemedInput
              label="Concentração do Padrão"
              value={concentration}
              onChangeText={setConcentration}
              keyboardType="numeric"
              placeholder={`Unidade em ${setup?.unit || "un"}`}
              autoFocus
            />
            <PrimaryButton
              title="Iniciar Captura"
              onPress={handleStartCapture}
              disabled={!concentration}
            />
          </View>
        </View>
      </Modal>

      {/* Conteúdo Principal */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <BackButton />
        <ThemedText style={styles.title}>Curva de Calibração</ThemedText>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isCurveCalculated && result?.calibration_curve && (
          <View style={[styles.resultCard, { backgroundColor: cardColor }]}>
            <CheckCircle size={32} color={accentColor} />
            <View style={styles.resultTextContainer}>
              <ThemedText style={styles.resultLabel}>
                Calibração Concluída!
              </ThemedText>
              <ThemedText
                style={[styles.resultValue, { color: textSecondaryColor }]}>
                Eq: {result.calibration_curve.equation}
              </ThemedText>
              <ThemedText
                style={[styles.resultValue, { color: textSecondaryColor }]}>
                R²: {result.calibration_curve.r_squared.toFixed(4)}
              </ThemedText>
            </View>
          </View>
        )}

        <ThemedText style={styles.sectionTitle}>Padrões</ThemedText>

        {capturedStandards.length > 0 ? (
          <View style={[styles.listContainer, { backgroundColor: cardColor }]}>
            {capturedStandards.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.standardItem,
                  index < capturedStandards.length - 1 && {
                    borderBottomWidth: 1,
                    borderColor,
                  },
                ]}>
                <FlaskConical size={20} color={textColor} />
                <ThemedText style={styles.standardText}>
                  {item.concentration} {setup?.unit || ""}
                </ThemedText>
                {!isCurveCalculated && (
                  <TouchableOpacity
                    onPress={() => setStandardToRemove(item.id)}>
                    <Trash2 size={20} color={dangerColor} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: cardColor }]}>
            <ThemedText
              style={[styles.emptyText, { color: textSecondaryColor }]}>
              Adicione pelo menos 2 padrões para criar a curva.
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Footer Fixo */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.sm,
            borderTopColor: borderColor,
            backgroundColor,
          },
        ]}>
        {isCurveCalculated ? (
          <PrimaryButton
            title="Próximo: Medir Amostras"
            onPress={() => router.push("/analysis/capture-samples")}
            icon={<Beaker size={20} color="white" />}
          />
        ) : (
          <>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: accentColor }]}
              onPress={() => setUiState("adding")}
              disabled={isCalculatingCurve}>
              <Plus size={24} color="white" />
            </TouchableOpacity>
            <PrimaryButton
              title="Calcular Curva"
              onPress={actions.calculateCalibrationCurve}
              disabled={capturedStandards.length < 2 || isCalculatingCurve}
              loading={isCalculatingCurve}
              icon={<Bot size={20} color="white" />}
              style={{ flex: 1 }}
            />
          </>
        )}
      </View>
    </ThemedView>
  );
}

// --- Estilos Refatorados ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  scrollContent: { paddingHorizontal: Padding.md, paddingBottom: 120 },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginTop: Margin.lg,
    marginBottom: Margin.sm,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: Spacing.md,
    padding: Padding.md,
    borderTopWidth: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: { borderRadius: BorderRadius.lg, overflow: "hidden" },
  standardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Padding.md,
    gap: Spacing.md,
  },
  standardText: { flex: 1, fontSize: FontSize.md },
  emptyContainer: {
    padding: Padding.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.lg,
  },
  emptyText: { textAlign: "center", fontSize: FontSize.md },
  resultCard: {
    marginBottom: Margin.lg,
    padding: Padding.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  resultTextContainer: {},
  resultLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  resultValue: { fontSize: FontSize.md },
  modalInputContainer: {
    flex: 1,
    justifyContent: "center",
    padding: Padding.lg,
  },
  modalInputContent: {
    padding: Padding.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.lg,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.lg,
    gap: Spacing.lg,
  },
  permissionText: {
    textAlign: "center",
    fontSize: FontSize.lg,
  },
  captureOverlay: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  captureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Padding.lg,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  captureTitle: {
    color: "white",
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  closeButton: { padding: Spacing.sm },
  captureFooter: {
    alignItems: "center",
    padding: Padding.xl,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  progressText: {
    color: "white",
    fontSize: FontSize.md,
    marginBottom: Margin.md,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: "center",
  },
});
