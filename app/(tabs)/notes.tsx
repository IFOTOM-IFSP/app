import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Tela de Anotações</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20 },
});
