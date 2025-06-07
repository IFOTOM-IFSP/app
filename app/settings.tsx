import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OptionsScreen() {
  const router = useRouter();

  const handleChangeName = async () => {
    Alert.alert("Trocar de nome", "Tem certeza que deseja trocar seu nome?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          await AsyncStorage.removeItem("userName");
          router.replace("/(auth)/enter-name");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Button title="Trocar de nome" onPress={handleChangeName} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});
