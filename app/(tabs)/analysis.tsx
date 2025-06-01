import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalysisScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Tela de analises</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20 },
});
