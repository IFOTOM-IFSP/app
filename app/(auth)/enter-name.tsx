import { AuthLayout } from "@/components/AuthLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Colors } from "@/constants/Colors";
import { saveUserName } from "@/storage/userStorage";
import { useRouter } from "expo-router";
import React, { JSX, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EnterNameScreen(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSaveNameAndProceed = async (): Promise<void> => {
    if (name.trim() === "") {
      Alert.alert(
        "Nome Inválido",
        "Por favor, insira seu nome para continuar."
      );
      return;
    }
    setIsLoading(true);
    try {
      await saveUserName(name.trim());
      console.log("EnterNameScreen: Nome salvo com sucesso:", name);
      router.replace("/");
    } catch (error) {
      console.error("EnterNameScreen: Falha ao salvar nome e navegar:", error);
      Alert.alert("Erro", "Não foi possível salvar seu nome. Tente novamente.");
    } finally {
      setIsLoading(false);
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
          <Text style={[styles.title, { color: Colors.light.textPrimary }]}>
            Como podemos te chamar?
          </Text>
          <Text
            style={[styles.subtitle, { color: Colors.light.textSecondary }]}>
            Isso nos ajudará a personalizar sua experiência no iFOTOM.
          </Text>
          <TextInput
            style={[styles.input, { color: Colors.light.text }]}
            placeholder="Digite seu nome ou apelido"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoFocus={true}
            returnKeyType="done"
            onSubmitEditing={handleSaveNameAndProceed}
            editable={!isLoading}
          />
          <PrimaryButton
            title="Salvar e Continuar"
            onPress={handleSaveNameAndProceed}
            style={styles.actionButtonCustom}
            loading={isLoading}
            disabled={isLoading}
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

    paddingTop: Platform.OS === "ios" ? 20 : 0,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    width: "100%",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 60,
    width: "100%",
    lineHeight: 16,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 6,
    paddingHorizontal: 20,
    marginBottom: 30,
    fontSize: 17,
    borderWidth: 0.8,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: Colors.light.text,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: Platform.OS === "android" ? 2 : 0,
  },
  actionButtonCustom: {
    width: "100%",
    marginTop: 20,
  },
});
