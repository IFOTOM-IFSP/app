import { Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Button } from "@/src/components/ui/Button";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface FormWrapperProps {
  children: React.ReactNode;
  buttonTitle?: string;
  isSubmitting?: boolean;
  onSubmit: () => void; // Adicionamos a função de submit aqui
}

export function FormWrapper({
  children,
  buttonTitle = "Próximo",
  isSubmitting = false,
  onSubmit,
}: FormWrapperProps) {
  const borderColor = useThemeValue("border");
  const backgroundColor = useThemeValue("background"); // Para o rodapé

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // Pode ajustar conforme necessário
    >
      {/* Área de Rolagem para os campos do formulário */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

      {/* Rodapé fixo para o botão */}
      <View
        style={[
          styles.footer,
          { borderTopColor: borderColor, backgroundColor },
        ]}>
        <Button
          title={buttonTitle}
          onPress={onSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Padding.lg,
  },
  footer: {
    flex: 0.2,
    padding: Padding.md,
  },
  button: {
    borderRadius: 8,
  },
});
