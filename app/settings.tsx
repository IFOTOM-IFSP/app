import React from "react";
import { StyleSheet, Text, Button, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function OptionsScreen() {
  const router = useRouter();

  const handleChangeName = async () => {
    Alert.alert(
      "Trocar de nome",
      "Tem certeza que deseja trocar seu nome?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            await AsyncStorage.removeItem("userName");
            router.replace("/(auth)/enter-name");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{"< Voltar"}</Text>
      </TouchableOpacity>
      <Button title="Trocar de nome" onPress={handleChangeName} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007aff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#2c3e50",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "500",
  },
});