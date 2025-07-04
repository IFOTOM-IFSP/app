import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { FontSize, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { initializeNotifications } from "@/service/notificationService";
import { ThemeProvider } from "@/state/ThemeContext";
import { useUserStore } from "@/state/userStore";
import { Slot, SplashScreen, usePathname, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { JSX, useEffect } from "react";
import { StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(console.warn);

function LoadingScreen() {
  const textColor = useThemeValue("text");
  const loaderAnimation = require("@/assets/images/loader_animation.json");

  return (
    <ThemedView style={styles.loaderContainer}>
      <View style={styles.loaderContainer2}>
        <ThemedText style={[styles.loaderText, { color: textColor }]}>
          Carregando
        </ThemedText>
        <LottieView
          style={styles.loaderAnimation}
          source={loaderAnimation}
          autoPlay={true}
          loop={true}
        />
      </View>
    </ThemedView>
  );
}

export default function RootLayout(): JSX.Element {
  const isLoading = useUserStore((state) => state.isLoading);
  const isFirstLaunch = useUserStore((state) => state.isFirstLaunch);
  const init = useUserStore((state) => state.actions.init);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log(
      "ROOT_LAYOUT [EFFECT INIT]: Chamando init da store (APENAS UMA VEZ)..."
    );
    init();
    initializeNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(
      `ROOT_LAYOUT [EFFECT NAV]: isLoading=${isLoading}, isFirstLaunch=${isFirstLaunch}, pathname=${pathname}`
    );

    if (isLoading) {
      return;
    }

    const authRoutes = ["/welcome", "/enter-name"];
    const welcomeScreenPath = "/welcome";

    if (isFirstLaunch && !authRoutes.includes(pathname)) {
      console.log(
        `ROOT_LAYOUT [EFFECT NAV]: Redirecionando para ${welcomeScreenPath} (rota não permitida no fluxo de auth)`
      );
      router.replace(welcomeScreenPath);
    } else if (
      !isFirstLaunch &&
      authRoutes.some((route) => pathname.startsWith(route))
    ) {
      console.log(
        `ROOT_LAYOUT [EFFECT NAV]: Usuário logado tentando acessar rota de auth. Redirecionando para /`
      );
      router.replace("/");
    }

    console.log("ROOT_LAYOUT [EFFECT NAV]: Escondendo SplashScreen.");
    SplashScreen.hideAsync().catch(console.warn);
  }, [isLoading, isFirstLaunch, pathname, router]);

  console.log(
    `ROOT_LAYOUT [RENDER]: App está ${isLoading ? "carregando" : "pronto"}.`
  );

  return (
    <ThemeProvider>{isLoading ? <LoadingScreen /> : <Slot />}</ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    height: 100,
    padding: Padding.sm,
  },
  loaderText: {
    fontSize: FontSize.lg,
  },
  loaderAnimation: {
    width: 60,
    height: 50,
    marginLeft: -10,
  },
});
