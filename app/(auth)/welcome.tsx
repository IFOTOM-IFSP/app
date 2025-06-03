import { AuthLayout } from "@/components/AuthLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen(): JSX.Element {
  const router = useRouter();

  const handleProceed = () => {
    console.log("WelcomeScreen: handleProceed - Botão 'Iniciar' clicado.");
    router.replace("/(auth)/enter-name");
  };

  return (
    <AuthLayout>
      <View style={styles.mainContent}>
        <Image
          style={styles.image}
          source={require("@/assets/images/scientist.png")}
        />
        <Text style={styles.appName}>iFOTOM</Text>
        <Text style={styles.tagline}>
          Análises espectrofotométricas na sua mão.
        </Text>
        <PrimaryButton
          title="Vamos lá!"
          onPress={handleProceed}
          style={styles.proceedButtonCustom}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  appName: {
    fontSize: 52,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 60,
    paddingHorizontal: 15,
    lineHeight: 20,
    fontWeight: "700",
  },
  proceedButtonCustom: {
    marginTop: 30,
    width: "90%",
  },
});
