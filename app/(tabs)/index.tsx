import { AntDesign, FontAwesome5, SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UsefulSections } from "@/components/common/UsefulSections";
import { HomeHeader } from "@/components/specific/home/HomeHeader";
import { StartAnalysisCard } from "@/components/specific/home/StartAnalysisCard";
import { Padding } from "@/constants/Styles";
import { useUserStore } from "@/context/userStore";
import { useThemeValue } from "@/hooks/useThemeValue";

type AppRouter = ReturnType<typeof useRouter>;
const getUsefulSectionsData = (router: AppRouter) => [
  {
    id: "ar-scan",
    label: "AR Scan",
    iconName: "vr-cardboard",
    iconComponent: FontAwesome5,
    onPress: () => console.log("AR Scan Pressionado"),
  },
  {
    id: "about",
    label: "sobre",
    iconName: "exclamationcircleo",
    iconComponent: AntDesign,
    onPress: () => router.push("/about"),
  },
  {
    id: "doubts",
    label: "Dúvidas",
    iconName: "question",
    iconComponent: SimpleLineIcons,
    onPress: () => router.push("/doubts"),
  },
  {
    id: "more",
    label: "Mais",
    iconName: "options",
    iconComponent: SimpleLineIcons,
    onPress: () => router.push("/options"),
  },
];

export default function HomeScreen() {
  const userName = useUserStore((state) => state.name);
  const loadingName = useUserStore((state) => state.isLoading);

  const router = useRouter();
  const backgroundColor = useThemeValue("background");
  const tintColor = useThemeValue("tint");
  const usefulSectionsData = getUsefulSectionsData(router);

  const handleStartAnalysis = () => {
    console.log("Botão SIM para iniciar análise clicado");
    router.push("/acquisition");
  };

  const handleSettingsPress = () => {
    router.push("/settings");
    console.log("Botão de configurações - Pressionado");
  };

  if (loadingName) {
    return (
      <SafeAreaView
        style={[styles.safeArea, styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={tintColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <HomeHeader userName={userName} onSettingsPress={handleSettingsPress} />
        <StartAnalysisCard onPress={handleStartAnalysis} />
        <UsefulSections title={true} sections={usefulSectionsData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: Padding.md,
  },
  scrollContent: {
    paddingBottom: Padding.lg,
  },
});
