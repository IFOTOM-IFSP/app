import { AuthLayout } from "@/src/components/layouts/AuthLayout";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/src/constants/Styles";
import { useRouter } from "expo-router";
import { JSX } from "react";
import { Image, StyleSheet, View } from "react-native";

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
          accessibilityLabel="Ilustração de um cientista segurando um frasco."
        />
        <ThemedText style={styles.appName}>iFOTOM</ThemedText>
        <ThemedText style={styles.tagline}>
          Análises espectrofotométricas na sua mão.
        </ThemedText>
        <Button
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
    marginBottom: Margin.md,
  },
  appName: {
    fontSize: FontSize.displayLg,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.sm,
  },
  tagline: {
    fontSize: FontSize.sm,
    textAlign: "center",
    marginBottom: Margin.xxxxl,
    paddingHorizontal: Padding.sm,
    lineHeight: 20,
    fontWeight: FontWeight.bold,
  },
  proceedButtonCustom: {
    marginTop: Margin.xl,
    width: "90%",
  },
});
