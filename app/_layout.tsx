import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { FontSize, Padding } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useSettingsStore } from "@/src/store/settingsStore";
import { ThemeProvider } from "@/src/store/ThemeContext";
import { useUserStore } from "@/src/store/userStore";
import * as Sentry from "@sentry/react-native";
import { Slot, SplashScreen, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration?.(),
    Sentry.feedbackIntegration?.(),
  ].filter(Boolean),
});

SplashScreen.preventAutoHideAsync().catch(console.warn);

function LoadingScreen() {
  const textColor = useThemeValue("text");
  const loaderAnimation = require("@/assets/images/loader_animation.json");

  return (
    <ThemedView
      style={styles.loaderContainer}
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando">
      <View style={styles.loaderContainer2}>
        <ThemedText style={[styles.loaderText, { color: textColor }]}>
          Carregando
        </ThemedText>
        <LottieView
          style={styles.loaderAnimation}
          source={loaderAnimation}
          autoPlay
          loop
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

  const settingsHasHydratedNow = useSettingsStore.persist.hasHydrated();
  const [settingsHydrated, setSettingsHydrated] = useState(
    settingsHasHydratedNow
  );
  useEffect(() => {
    init();
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setSettingsHydrated(true);
    });

    return unsub;
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

  useEffect(() => {
    if (!isLoading && settingsHydrated && pathname) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isLoading, settingsHydrated, pathname]);
  return (
    <PaperProvider>
      <StatusBar translucent animated />
      <ThemeProvider>
        {isLoading || !settingsHydrated ? <LoadingScreen /> : <Slot />}
      </ThemeProvider>
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
