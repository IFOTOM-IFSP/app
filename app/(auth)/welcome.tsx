import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen(): JSX.Element {
  const router = useRouter();

  const handleProceed = () => {
    console.log("WelcomeScreen: handleProceed - Botão 'Iniciar' clicado.");
    console.log("WelcomeScreen: Tentando navegar para: / (auth)/enter-name");
    try {
      router.replace("/(auth)/enter-name");
      console.log(
        "WelcomeScreen: router.replace('/(auth)/enter-name') chamado com sucesso."
      );
    } catch (error) {
      console.error("WelcomeScreen: Erro ao chamar router.push:", error);
    }
  };

  return (
    <LinearGradient
      colors={[
        "#B995C8",
        "rgb(218, 197, 228)",
        "rgb(243, 243, 243)",
        "rgb(243, 243, 243)",
        "rgb(243, 243, 243)",
      ]}
      style={styles.gradientBackground}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.outerContainer}>
          <View style={styles.mainContent}>
            <Image
              style={styles.image}
              source={require("@/assets/images/scientist.png")}
            />
            <Text style={styles.appName}>iFOTOM</Text>
            <Text style={styles.tagline}>
              Análises espectrofotométricas na sua mão.
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.proceedButton}
              onPress={handleProceed}>
              <Text style={styles.proceedButtonText}>Vamos lá!</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.foot}>
            <Text style={styles.footerText}>IFSP - Campinas</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  outerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "android" ? 25 : 40,
    paddingBottom: Platform.OS === "android" ? 15 : 20,
  },
  mainContent: {
    flex: 1,
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
  proceedButton: {
    width: "90%",
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    borderRadius: 20,
    elevation: 1,
    marginTop: 30,
  },
  proceedButtonText: {
    color: Colors.light.textWhite,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  foot: {
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "600",
  },
});
