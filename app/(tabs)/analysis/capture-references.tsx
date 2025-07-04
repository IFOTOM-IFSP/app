import { useAnalysisActions, useAnalysisStore } from "@/state/analysisStore";
import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Camera,
  Check,
  Info,
  Lightbulb,
  LightbulbOff,
  LucideProps,
  RotateCcw,
  Sparkles,
  Upload,
} from "lucide-react-native";
import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Ícones e Componentes
import BackButton from "@/components/ui/BackButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
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

const NUM_FRAMES_TO_CAPTURE = 10;
type CapturePhase = "exposure_setup" | "dark_capture" | "white_capture";

// --- Interfaces de Props para Sub-componentes ---
interface InstructionCardProps {
  isVisible: boolean;
  config: {
    icon: ReactNode;
    instruction: string;
  };
}

interface ActionButtonProps {
  icon: ComponentType<LucideProps>;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

interface ProgressBarProps {
  count: number;
  total: number;
}

interface ShutterButtonProps {
  phase: CapturePhase;
  isComplete: boolean;
  isProcessing: boolean;
  captureCount: number;
  onCapture: () => void;
  onNextPhase: () => void;
}

interface ConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

// --- Componentes Refatorados ---
const InstructionCard = ({ isVisible, config }: InstructionCardProps) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        styles.instructionBox,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents={isVisible ? "auto" : "none"}>
      <BlurView intensity={60} tint="dark" style={styles.blurBackground} />
      {config.icon}
      <View style={styles.instructionTextContainer}>
        <ThemedText style={styles.instructionTitle}>Instruções</ThemedText>
        <ThemedText style={styles.instructionText}>
          {config.instruction}
        </ThemedText>
      </View>
    </Animated.View>
  );
};

const ActionButton = ({
  icon: Icon,
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}: ActionButtonProps) => (
  <TouchableOpacity
    style={[styles.actionButton, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}>
    <BlurView intensity={90} tint="dark" style={styles.blurBackground} />
    <Icon size={20} color="white" />
  </TouchableOpacity>
);

const ProgressBar = ({ count, total }: ProgressBarProps) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: (count / total) * 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [count, total]);

  return (
    <View style={styles.progressContainer}>
      <ThemedText style={styles.progressText}>
        {count} / {total}
      </ThemedText>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const ShutterButton = ({
  phase,
  isComplete,
  isProcessing,
  captureCount,
  onCapture,
  onNextPhase,
}: ShutterButtonProps) => {
  const accentColor = useThemeValue("primary");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isComplete ? 1.05 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isComplete]);

  const isSetupPhase = phase === "exposure_setup";
  const mainAction = isComplete ? onNextPhase : onCapture;

  const getButtonContent = () => {
    if (isProcessing)
      return <ActivityIndicator color={isComplete ? "white" : "black"} />;
    if (isComplete) return <Check size={32} color="white" />;
    if (isSetupPhase) return <Sparkles size={32} color="black" />;
    return <Camera size={32} color="black" />;
  };

  const getAccessibilityLabel = () => {
    if (isProcessing) return "Processando...";
    if (isComplete)
      return phase === "white_capture"
        ? "Processar referências"
        : "Continuar para a próxima fase";
    if (isSetupPhase) return "Calibrar exposição da câmera";
    return `Capturar imagem ${captureCount + 1} de ${NUM_FRAMES_TO_CAPTURE}`;
  };

  const buttonText = isComplete
    ? phase === "white_capture"
      ? "Processar"
      : "Seguir"
    : "";

  return (
    <View style={styles.shutterContainer}>
      <TouchableOpacity
        onPress={isSetupPhase ? onNextPhase : mainAction}
        disabled={isProcessing}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel()}>
        <Animated.View
          style={[
            styles.shutterButton,
            isComplete && { backgroundColor: accentColor },
            { transform: [{ scale: scaleAnim }] },
          ]}>
          {getButtonContent()}
        </Animated.View>
      </TouchableOpacity>
      {isComplete && (
        <ThemedText style={styles.shutterText}>{buttonText}</ThemedText>
      )}
    </View>
  );
};

const ConfirmationModal = ({
  isVisible,
  onConfirm,
  onDismiss,
  title,
  message,
  confirmText = "Confirmar",
}: ConfirmationModalProps) => {
  const cardBg = useThemeValue("card");
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <ThemedText style={styles.modalMessage}>{message}</ThemedText>
          <View style={styles.modalActions}>
            <PrimaryButton title="Cancelar" onPress={onDismiss} />
            <PrimaryButton title={confirmText} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LoadingOverlay = ({ text }: { text: string }) => (
  <View style={styles.loadingOverlay}>
    <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
    <ActivityIndicator size="large" color="white" />
    <ThemedText style={styles.loadingText}>{text}</ThemedText>
  </View>
);

export default function CaptureReferencesScreen() {
  const router = useRouter();
  const store = useAnalysisStore();
  const actions = useAnalysisActions();
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  const [phase, setPhase] = useState<CapturePhase>("exposure_setup");
  const [darkFrameUris, setDarkFrameUris] = useState<string[]>([]);
  const [capturedUris, setCapturedUris] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isResetModalVisible, setResetModalVisible] = useState(false);

  const accentColor = useThemeValue("primary");
  const isProcessingOnStore = store.currentStep === "processing_references";
  const textColor = useThemeValue("text");

  // CORRIGIDO: Adicionada a dependência 'store.currentStep'
  // O hook agora irá re-executar sempre que o passo da análise mudar,
  // acionando a navegação corretamente.
  useFocusEffect(
    useCallback(() => {
      const { currentStep } = store; // Lê o estado diretamente
      if (currentStep === "calibration_standards_capture") {
        router.replace("/analysis/calibration");
      } else if (currentStep === "sample_capture") {
        router.replace("/analysis/capture-samples");
      }
    }, [store.currentStep, router])
  );

  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => setShowInstructions(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showInstructions, phase]);

  const handleNextPhase = async () => {
    switch (phase) {
      case "exposure_setup":
        setPhase("dark_capture");
        setShowInstructions(true);
        break;

      case "dark_capture":
        setDarkFrameUris(capturedUris);
        setPhase("white_capture");
        setCapturedUris([]);
        setShowInstructions(true);
        break;

      case "white_capture":
        await actions.processAndCacheReferences(darkFrameUris, capturedUris);
        break;
    }
  };

  const handleCapture = async () => {
    if (
      capturedUris.length >= NUM_FRAMES_TO_CAPTURE ||
      !cameraRef.current ||
      isCapturing
    )
      return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) setCapturedUris((prev) => [...prev, photo.uri]);
    } catch (error) {
      console.error("Camera Error:", error);
      actions.showUiNotification({
        title: "Erro na Câmera",
        message: "Não foi possível capturar a imagem.",
        type: "error",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleImportImages = async () => {
    if (!galleryPermission?.granted) {
      const { status } = await requestGalleryPermission();
      if (status !== "granted") {
        actions.showUiNotification({
          title: "Permissão Necessária",
          message:
            "É necessário permitir o acesso à galeria para importar imagens.",
          type: "warning",
        });
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: NUM_FRAMES_TO_CAPTURE - capturedUris.length,
    });

    if (!result.canceled) {
      setCapturedUris((prev) => [
        ...prev,
        ...result.assets.map((asset) => asset.uri),
      ]);
    }
  };

  if (!permission)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={textColor} />
      </View>
    );

  if (!permission.granted)
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.permissionText}>
          Precisamos da sua permissão para usar a câmera.
        </ThemedText>
        <PrimaryButton title="Conceder Permissão" onPress={requestPermission} />
      </ThemedView>
    );

  const phaseConfig = {
    exposure_setup: {
      title: "Ajuste da Câmera",
      icon: <Sparkles size={24} color={accentColor} />,
      instruction:
        "Posicione a fonte de luz e a referência de BRANCO. Toque no botão principal para a câmera se calibrar.",
    },
    dark_capture: {
      title: "Referência de Escuro",
      icon: <LightbulbOff size={24} color={accentColor} />,
      instruction:
        "Bloqueie TODA a luz e capture 10 imagens. Use os botões no topo para importar ou resetar.",
    },
    white_capture: {
      title: "Referência de Branco",
      icon: <Lightbulb size={24} color={accentColor} />,
      instruction:
        "Posicione novamente a referência de BRANCO e capture as 10 imagens.",
    },
  }[phase];

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        ref={cameraRef}
        facing="back"
      />

      <ConfirmationModal
        isVisible={isResetModalVisible}
        onDismiss={() => setResetModalVisible(false)}
        onConfirm={() => {
          setCapturedUris([]);
          setResetModalVisible(false);
        }}
        title="Resetar Capturas"
        message="Tem a certeza de que deseja apagar as imagens capturadas nesta etapa?"
        confirmText="Sim, Apagar"
      />

      <View
        style={[styles.topOverlay, { paddingTop: insets.top + Spacing.xs }]}>
        <BackButton />
        <ThemedText style={styles.title} numberOfLines={1}>
          {phaseConfig.title}
        </ThemedText>
        <View style={styles.topActions}>
          <ActionButton
            icon={Info}
            onPress={() => setShowInstructions(true)}
            accessibilityLabel="Mostrar instruções"
          />
          {phase !== "exposure_setup" && (
            <ActionButton
              icon={Upload}
              onPress={handleImportImages}
              disabled={
                isCapturing || capturedUris.length >= NUM_FRAMES_TO_CAPTURE
              }
              accessibilityLabel="Importar imagens"
              accessibilityHint="Importa imagens da galeria do seu dispositivo"
            />
          )}
          {phase !== "exposure_setup" && (
            <ActionButton
              icon={RotateCcw}
              onPress={() => setResetModalVisible(true)}
              disabled={isCapturing || capturedUris.length === 0}
              accessibilityLabel="Resetar capturas"
              accessibilityHint="Apaga as imagens capturadas nesta etapa"
            />
          )}
        </View>
      </View>

      <InstructionCard isVisible={showInstructions} config={phaseConfig} />

      <View
        style={[
          styles.bottomOverlay,
          { paddingBottom: insets.bottom + Spacing.sm },
        ]}>
        <BlurView intensity={20} tint="dark" style={styles.blurBackground} />
        {phase !== "exposure_setup" && (
          <ProgressBar
            count={capturedUris.length}
            total={NUM_FRAMES_TO_CAPTURE}
          />
        )}
        <ShutterButton
          phase={phase}
          isComplete={capturedUris.length >= NUM_FRAMES_TO_CAPTURE}
          isProcessing={isCapturing}
          captureCount={capturedUris.length}
          onCapture={handleCapture}
          onNextPhase={handleNextPhase}
        />
      </View>

      {isProcessingOnStore && (
        <LoadingOverlay text="Processando Referências..." />
      )}
    </View>
  );
}

// --- Estilos Refatorados ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.lg,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: Margin.lg,
    fontSize: FontSize.lg,
  },

  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    zIndex: 20,
    gap: Spacing.md,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  topActions: { flexDirection: "row", gap: Spacing.sm },

  instructionBox: {
    position: "absolute",
    top: "15%",
    left: Margin.lg,
    right: Margin.lg,
    flexDirection: "row",
    alignItems: "center",
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    zIndex: 10,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.lg - 1,
  },
  instructionTextContainer: { flex: 1, marginLeft: Margin.md },
  instructionTitle: {
    fontWeight: "bold",
    fontSize: FontSize.md,
    color: "white",
  },
  instructionText: {
    fontSize: FontSize.sm,
    color: "rgba(235, 235, 245, 0.8)",
    marginTop: Spacing.xs,
  },

  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Padding.md,
    alignItems: "center",
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
  },

  shutterContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Padding.md,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  shutterText: {
    color: "white",
    fontWeight: FontWeight.bold,
    marginTop: Spacing.md,
    fontSize: FontSize.md,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  disabled: { opacity: 0.4 },

  progressContainer: {
    width: "80%",
    marginBottom: Margin.lg,
    alignItems: "center",
  },
  progressText: {
    color: "white",
    marginBottom: Spacing.sm,
    fontWeight: FontWeight.medium,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  loadingText: {
    color: "white",
    marginTop: Margin.md,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "85%",
    padding: Padding.lg,
    borderRadius: BorderRadius.lg,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
  },
  modalMessage: {
    fontSize: FontSize.md,
    marginBottom: Margin.xl,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.md,
  },
});
