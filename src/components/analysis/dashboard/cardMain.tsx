import { FontWeight, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CardMain() {
  const cardColor = "rgba(170, 110, 211, 1)";
  const textWhite = useThemeValue("textWhite");
  return (
    <TouchableOpacity
      style={[styles.analysisStart, { backgroundColor: cardColor }]}
      activeOpacity={0.9}
      onPress={() => router.push("/(tabs)/analysis/create")}>
      <View style={styles.textContainerCard}>
        <ThemedText style={[styles.titleCard, { color: textWhite }]}>
          Iniciar análise
        </ThemedText>
      </View>

      <View style={styles.imageContainerCard}>
        <Image
          source={require("@/assets/images/spectrum_illustration.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  analysisStart: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: 120,
    marginHorizontal: Padding.lg,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageContainerCard: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    right: -30,
    top: -50,
    width: 260,
    height: 260,
  },

  textContainerCard: {
    flex: 4,
    justifyContent: "center",
    padding: Padding.md,
  },
  titleCard: {
    fontSize: 24,
    fontWeight: FontWeight.semiBold,
  },
});
