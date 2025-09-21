import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { FontSize, Padding } from "@/src/constants/Styles";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { initializeSettings } from "@/src/store/settingsStore";
import { ThemeProvider } from "@/src/store/ThemeContext";
import { useUserStore } from "@/src/store/userStore";
import * as Sentry from "@sentry/react-native";
import { Slot, SplashScreen, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";

Sentry.init({
  dsn: "https://edcb99ad8ca7e66368e6d1f07687a130@o4509852568584192.ingest.de.sentry.io/4509852571074640",
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

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

export default Sentry.wrap(function RootLayout() {
  const isLoading = useUserStore((state) => state.isLoading);
  const isFirstLaunch = useUserStore((state) => state.isFirstLaunch);
  const init = useUserStore((state) => state.actions.init);
  const router = useRouter();
  const pathname = usePathname();
  useNotifications();
  useEffect(() => {
    init();
    initializeSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const authRoutes = ["/welcome", "/enter-name"];
    const welcomeScreenPath = "/welcome";

    if (isFirstLaunch && !authRoutes.includes(pathname)) {
      router.replace(welcomeScreenPath);
    } else if (
      !isFirstLaunch &&
      authRoutes.some((route) => pathname.startsWith(route))
    ) {
      router.replace("/");
    }

    SplashScreen.hideAsync().catch(console.warn);
  }, [isLoading, isFirstLaunch, pathname, router]);

  return (
    <PaperProvider>
      <StatusBar translucent animated />
      <ThemeProvider>{isLoading ? <LoadingScreen /> : <Slot />}</ThemeProvider>
    </PaperProvider>
  );
});

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
