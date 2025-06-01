import { Colors } from "@/constants/Colors";
import { saveUserName } from "@/storage/userStorage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { JSX, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EnterNameScreen(): JSX.Element {
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const handleSaveNameAndProceed = async (): Promise<void> => {
    if (name.trim() === "") {
      Alert.alert(
        "Nome Inválido",
        "Por favor, insira seu nome para continuar."
      );
      return;
    }
    try {
      await saveUserName(name.trim());
      console.log("EnterNameScreen: Nome salvo com sucesso:", name);
      router.replace("/");
    } catch (error) {
      console.error("EnterNameScreen: Falha ao salvar nome e navegar:", error);
      Alert.alert("Erro", "Não foi possível salvar seu nome. Tente novamente.");
    }
  };

  return (
    <LinearGradient
      colors={[
        "#B995C8",
        "rgb(218, 197, 228)",
        "rgb(243, 243, 243)",
        "rgb(243, 243, 243)",
        "rgb(243, 243, 243)",
      ]}
      style={styles.gradientBackground}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingContainer}>
          <View style={styles.container}>
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
            />
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors.light.tint },
              ]}
              onPress={handleSaveNameAndProceed}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.actionButtonText,
                  { color: Colors.light.textWhite },
                ]}>
                Salvar e Continuar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.foot}>
          <Text style={styles.footerText}>IFSP - Campinas</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 80,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 35,
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 6,
    paddingHorizontal: 20,
    marginBottom: 30,
    fontSize: 17,
    borderWidth: 0.8,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: Colors.light.text,

    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    width: "100%",

    paddingVertical: 16,
    borderRadius: 20,
    elevation: 1,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  foot: {
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "600",
  },
});
