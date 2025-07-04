// Localização: src/components/analysis/CameraCapture.tsx

import { CameraView } from "expo-camera";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

// Componentes, Ícones e Tipos
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Margin, Padding, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Camera } from "lucide-react-native";

// --- Interface de Props ---
interface CameraCaptureProps {
  onCaptureComplete: (uris: string[]) => void;
  numFrames: number;
  disabled?: boolean;
  title?: string;
}

export function CameraCapture({
  onCaptureComplete,
  numFrames,
  disabled = false,
  title,
}: CameraCaptureProps) {
  const cameraRef = useRef<CameraView>(null);
  const [capturedUris, setCapturedUris] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const accentColor = useThemeValue("primary");
  const borderColor = useThemeValue("border");
  const textSecondaryColor = useThemeValue("textSecondary");

  const handleCapture = async () => {
    if (isSessionComplete || isCapturing || !cameraRef.current) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        const newUris = [...capturedUris, photo.uri];
        setCapturedUris(newUris);

        if (newUris.length === numFrames) {
          onCaptureComplete(newUris);
          Alert.alert(
            "Captura Concluída",
            `${numFrames} imagens foram capturadas com sucesso.`
          );
          setIsSessionComplete(true);
        }
      }
    } catch (error) {
      console.error("Capture error:", error);
      Alert.alert("Erro", "Não foi possível capturar a imagem.");
    } finally {
      setIsCapturing(false);
    }
  };

  const progress = (capturedUris.length / numFrames) * 100;

  return (
    <ThemedView style={styles.container}>
      {title && <ThemedText style={styles.sectionTitle}>{title}</ThemedText>}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      </View>
      <View style={styles.progressContainer}>
        <ThemedText style={{ color: textSecondaryColor }}>
          Progresso: {capturedUris.length} / {numFrames}
        </ThemedText>
        <View
          style={[
            styles.progressBarBackground,
            { backgroundColor: borderColor },
          ]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%`, backgroundColor: accentColor },
            ]}
          />
        </View>
      </View>
      <PrimaryButton
        title={isSessionComplete ? "Captura Concluída" : "Capturar Imagem"}
        onPress={handleCapture}
        disabled={disabled || isSessionComplete || isCapturing}
        icon={<Camera size={20} color="white" />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Padding.sm,
  },
  sectionTitle: {},
  cameraContainer: {
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: Margin.md,
  },
  camera: {
    flex: 1,
  },
  progressContainer: {
    marginVertical: Spacing.md,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e9ecef", // Usar cor do tema
    marginTop: Spacing.sm,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
});
