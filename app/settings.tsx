import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";

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
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.title}>Configurações</Text>
      </View>

      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          Alert.alert(
            "Sobre o aplicativo",
            "Alert ( depois trocamos por uma aba de sobre , ou remove essa porra kkkkk )"
          )
        }
      >
        <Text style={styles.optionText}> Sobre o aplicativo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => Alert.alert("Versão do App", "v1.0.0 (Fazer aquela graça kkk)")}
      >
        <Text style={styles.optionText}> Versão do App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleChangeName}>
        <Text style={styles.optionText}> Trocar de nome</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.optionText}> .... </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.accentPurple,
  },
  content: {
    paddingHorizontal: 16,
  },
    option: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: "90%",             
    alignSelf: "center",       
  },
  optionText: {
    fontSize: 18,
    color: "#111827",
  },
});