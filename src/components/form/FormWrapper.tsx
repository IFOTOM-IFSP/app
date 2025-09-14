import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

interface FormWrapperProps {
  children: React.ReactNode;
  buttonTitle?: string;
  isSubmitting?: boolean;
  keyboardVerticalOffset?: number;
}

export function FormWrapper({
  children,
  buttonTitle = "Próximo",
  isSubmitting = false,
  keyboardVerticalOffset = 80,
}: FormWrapperProps) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 16,
    maxHeight: 300,
  },
  buttonContainer: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
});
