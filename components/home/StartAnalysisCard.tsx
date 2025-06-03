import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StartAnalysisCardProps {
  onPress: () => void;
}

export function StartAnalysisCard({ onPress }: StartAnalysisCardProps) {
  return (
    <TouchableOpacity
      style={styles.cardTouchable}
      onPress={onPress}
      activeOpacity={0.85}>
      <LinearGradient
        colors={[
          Colors.light.accentPurple || "#8A4DBC",
          Colors.light.tint || "#6A0DAD",
        ]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.cardText}>Quer começar uma análise?</Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>SIM</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardTouchable: {
    height: 200,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardGradient: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 18,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.light.textWhite,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.background,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: Colors.light.tint,
    fontWeight: "bold",
    fontSize: 16,
  },
});
