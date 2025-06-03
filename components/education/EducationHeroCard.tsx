import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export function EducationHeroCard() {
  return (
    <View style={styles.heroCardContainer}>
      <View style={styles.heroTextContent}>
        <Text style={styles.heroTitle}>
          Bem-vindo ao{" "}
          <Text style={{ color: Colors.light.accentPurple || "#9D4EDD" }}>
            iFOTOM Aprender!
          </Text>
        </Text>
      </View>
      <Image
        source={require("@/assets/images/education.png")}
        style={styles.heroIllustration}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroCardContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    paddingTop: 40,
  },
  heroTextContent: {
    flex: 1,
    marginRight: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.textPrimary,

    lineHeight: 36,
  },
  heroIllustration: {
    width: 150,
    height: 150,
  },
});
