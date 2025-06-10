import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChallengeListScreen() {
   const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>{"< Voltar"}</Text>
            </TouchableOpacity>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007aff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  item: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  term: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  definition: {
    fontSize: 16,
    color: "#34495e",
    marginTop: 4,
  },
});