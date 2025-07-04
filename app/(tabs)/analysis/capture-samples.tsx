// Localização: src/app/analysis/capture-samples.tsx

import { useAnalysisActions, useAnalysisStore } from "@/state/analysisStore";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
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
import { AnalysisSetup, SampleData } from "@/interfaces/analysis";
import {
  Beaker,
  Bot,
  Camera,
  LoaderCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";

// --- Constantes e Tipos ---
const NUM_FRAMES_TO_CAPTURE = 10;
type UIState = "idle" | "capturing";

// --- Sub-componente: Modal de Captura de Amostra ---
const SampleCaptureModal = ({
  isVisible,
  setup,
  onComplete,
  onCancel,
}: {
  isVisible: boolean;
  setup: AnalysisSetup | null;
  onComplete: (uris: string[], dilutionFactor: number) => void;
  onCancel: () => void;
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedUris, setCapturedUris] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [dilutionFactor, setDilutionFactor] = useState("1");

  useEffect(() => {
    if (isVisible) {
      setCapturedUris([]);
      setDilutionFactor("1");
    }
  }, [isVisible]);

  const handleCapture = async () => {
    if (
      isCapturing ||
      !cameraRef.current ||
      capturedUris.length >= NUM_FRAMES_TO_CAPTURE
    )
      return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        const newUris = [...capturedUris, photo.uri];
        setCapturedUris(newUris);
        if (newUris.length >= NUM_FRAMES_TO_CAPTURE) {
          onComplete(newUris, parseFloat(dilutionFactor) || 1);
        }
      }
    } catch (error) {
      console.error("Erro de Câmera", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const renderContent = () => {
    if (!permission)
      return <ActivityIndicator style={StyleSheet.absoluteFill} />;
    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <ThemedText style={styles.permissionText}>
            Acesso à câmera é necessário.
          </ThemedText>
          <PrimaryButton
            title="Conceder Permissão"
            onPress={requestPermission}
          />
        </View>
      );
    }

    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraView
          style={StyleSheet.absoluteFill}
          ref={cameraRef}
          facing="back"
        />
        <View style={styles.captureOverlay}>
          <View style={styles.captureHeader}>
            <ThemedText style={styles.captureTitle}>Medir Amostra</ThemedText>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.captureFooter}>
            {setup?.analysisType === "quantitative" && (
              <View style={styles.dilutionInputContainer}>
                <ThemedInput
                  label="Fator de Diluição"
                  value={dilutionFactor}
                  onChangeText={setDilutionFactor}
                  keyboardType="numeric"
                  placeholder="e.g., 10"
                />
              </View>
            )}
            <ThemedText style={styles.progressText}>
              {capturedUris.length} / {NUM_FRAMES_TO_CAPTURE}
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.shutterButton,
                (isCapturing || capturedUris.length >= NUM_FRAMES_TO_CAPTURE) &&
                  styles.shutterDisabled,
              ]}
              onPress={handleCapture}
              disabled={
                isCapturing || capturedUris.length >= NUM_FRAMES_TO_CAPTURE
              }
              accessibilityLabel={`Capturar imagem ${capturedUris.length + 1}`}>
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

// --- Tela Principal Refatorada ---
export default function CaptureSamplesScreen() {
  const router = useRouter();
  const store = useAnalysisStore();
  const actions = useAnalysisActions();
  // CORRIGIDO: Desestruturação corrigida para obter `currentStep` do nível correto.
  const { setup, samples, savedAnalysisId } = store.sessionData;
  const { currentStep } = store;
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeValue("primary");

  const [uiState, setUiState] = useState<UIState>("idle");
  const [sampleToRemove, setSampleToRemove] = useState<string | null>(null);

  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const dangerColor = useThemeValue("warning");
  const borderColor = useThemeValue("border");
  const backgroundColor = useThemeValue("background");

  const capturedSamples = useMemo(
    () => samples.filter((s) => s.type === "unknown"),
    [samples]
  );

  useFocusEffect(
    useCallback(() => {
      // Navega para a página de resultados com o ID correto.
      if (currentStep === "results" && savedAnalysisId !== null) {
        router.replace(`/analysis/result/${savedAnalysisId}`);
      }
    }, [currentStep, savedAnalysisId, router])
  );

  const handleCaptureComplete = (uris: string[], dilution_factor: number) => {
    // CORRIGIDO: Gera um ID único sem usar 'crypto' para ser compatível com Hermes.
    const newId = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
    const newSample: SampleData = {
      id: newId,
      type: "unknown",
      dilution_factor,
      uris,
    };
    // Chama a ação do store (que precisa ser ajustada para aceitar o objeto completo).
    actions.addCapturedSample(newSample);
    setUiState("idle");
  };

  const handleRemoveConfirm = () => {
    if (sampleToRemove !== null) {
      actions.removeCapturedSample(sampleToRemove);
    }
    setSampleToRemove(null);
  };

  if (currentStep === "processing_final") {
    return (
      <ThemedView style={styles.centerContainer}>
        <LoaderCircle
          size={48}
          color={primaryColor}
          style={styles.loaderIcon}
        />
        <ThemedText style={styles.title}>Analisando...</ThemedText>
        <ThemedText style={styles.subtitle}>Por favor, aguarde.</ThemedText>
      </ThemedView>
    );
  }

  if (!setup) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Configuração da análise não encontrada.</ThemedText>
        <PrimaryButton title="Voltar" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* O modal de confirmação permanece o mesmo */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top, borderBottomColor: borderColor },
        ]}>
        <BackButton />
        <ThemedText style={styles.title}>Medir Amostras</ThemedText>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.sectionTitle}>Amostras Medidas</ThemedText>
        {capturedSamples.length > 0 ? (
          <View style={[styles.listContainer, { backgroundColor: cardColor }]}>
            {capturedSamples.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.sampleItem,
                  index < capturedSamples.length - 1 && {
                    borderBottomWidth: 1,
                    borderColor,
                  },
                ]}>
                <Beaker size={20} color={textColor} />
                <ThemedText style={styles.sampleText}>
                  Amostra {index + 1}
                  {item.dilution_factor && item.dilution_factor > 1
                    ? ` (DF: ${item.dilution_factor})`
                    : ""}
                </ThemedText>
                <TouchableOpacity onPress={() => setSampleToRemove(item.id)}>
                  <Trash2 size={20} color={dangerColor} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: cardColor }]}>
            <ThemedText style={styles.emptyText}>
              Nenhuma amostra medida ainda.
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.sm,
            borderTopColor: borderColor,
            backgroundColor,
          },
        ]}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: primaryColor }]}
          onPress={() => setUiState("capturing")}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
        <PrimaryButton
          title="Analisar Resultados"
          onPress={actions.runFinalAnalysis}
          disabled={capturedSamples.length === 0}
          icon={<Bot size={20} color="white" />}
          style={{ flex: 1 }}
        />
      </View>

      <SampleCaptureModal
        isVisible={uiState === "capturing"}
        onCancel={() => setUiState("idle")}
        onComplete={handleCaptureComplete}
        setup={setup}
      />
    </ThemedView>
  );
}

// --- ESTILOS Refatorados ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.lg,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.lg,
    gap: Spacing.lg,
  },
  permissionText: { textAlign: "center", fontSize: FontSize.lg },
  loaderIcon: { marginBottom: Margin.lg },
  header: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  subtitle: { fontSize: FontSize.md, marginTop: Spacing.sm },
  scrollContent: { paddingHorizontal: Padding.md, paddingBottom: 120 },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginTop: Margin.lg,
    marginBottom: Margin.sm,
  },
  listContainer: { borderRadius: BorderRadius.lg, overflow: "hidden" },
  sampleItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Padding.md,
    gap: Spacing.md,
  },
  sampleText: { flex: 1, fontSize: FontSize.md },
  emptyContainer: {
    padding: Padding.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.lg,
  },
  emptyText: { textAlign: "center", fontSize: FontSize.md },
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

  // Capture Modal Styles
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
    paddingTop: 50,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  captureTitle: {
    color: "white",
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  closeButton: { padding: Spacing.sm },
  captureFooter: { padding: Padding.xl, backgroundColor: "rgba(0,0,0,0.4)" },
  dilutionInputContainer: {
    paddingHorizontal: Padding.xl,
    marginBottom: Margin.md,
  },
  progressText: {
    color: "white",
    fontSize: FontSize.md,
    marginBottom: Margin.md,
    textAlign: "center",
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  shutterDisabled: { opacity: 0.5 },
});
