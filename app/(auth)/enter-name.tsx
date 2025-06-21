import { AuthLayout } from "@/components/layouts/AuthLayout";
import { FormInput } from "@/components/ui/FormInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/constants/Styles";
import { useUserStore } from "@/context/userStore";
import { useRouter } from "expo-router";
import React, { JSX, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";

export default function EnterNameScreen(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { saveName } = useUserStore((state) => state.actions);

  const handleSaveNameAndProceed = async (): Promise<void> => {
    if (name.trim() === "") {
      Alert.alert(
        "Nome Inválido",
        "Por favor, insira seu nome para continuar."
      );
      return;
    }
    setIsSaving(true);
    try {
      await saveName(name.trim());

      console.log(
        "EnterNameScreen: Nome salvo com sucesso via userStore:",
        name
      );
      router.replace("/");
    } catch (error) {
      console.error("EnterNameScreen: Falha ao salvar nome e navegar:", error);
      Alert.alert("Erro", "Não foi possível salvar seu nome. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const enterNameGradientProps = {
    start: { x: 1, y: 1 },
    end: { x: 0, y: 0 },
  };

  return (
    <AuthLayout
      gradientStart={enterNameGradientProps.start}
      gradientEnd={enterNameGradientProps.end}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}>
        <View style={styles.contentContainer}>
          <ThemedText style={[styles.title]}>
            Como podemos te chamar?
          </ThemedText>
          <ThemedText style={[styles.subtitle]}>
            Isso nos ajudará a personalizar sua experiência no iFOTOM.
          </ThemedText>
          <FormInput
            placeholder="Digite seu nome ou apelido"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoFocus={true}
            returnKeyType="done"
            onSubmitEditing={handleSaveNameAndProceed}
            editable={!isSaving}
          />
          <PrimaryButton
            title="Salvar e Continuar"
            onPress={handleSaveNameAndProceed}
            style={styles.actionButtonCustom}
            loading={isSaving}
            disabled={isSaving}
          />
        </View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  contentContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",

    paddingTop: Platform.OS === "ios" ? Padding.lg : 0,
    paddingBottom: Padding.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.sm,
    width: "100%",
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginBottom: Margin.xxxxl,
    width: "100%",
    lineHeight: 16,
  },
  actionButtonCustom: {
    width: "100%",
    marginTop: Margin.xxl,
  },
});
