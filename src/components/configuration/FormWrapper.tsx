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
  onSubmit: () => void;
  buttonTitle?: string;
  isSubmitting?: boolean;
}

/**
 * Um wrapper de layout para telas de formulário. Inclui KeyboardAvoidingView,
 * uma área de rolagem para os campos e um rodapé fixo com o botão de submissão.
 */
export function FormWrapper({
  children,
  onSubmit,
  buttonTitle = "Próximo",
  isSubmitting = false,
}: FormWrapperProps) {
  const borderColor = useThemeValue("border");
  const backgroundColor = useThemeValue("background");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

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
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.md,
    flexGrow: 1,
  },
  footer: {
    padding: Padding.md,
    borderTopWidth: 1,
  },
});
