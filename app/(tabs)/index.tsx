import {
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeHeader } from "@/components/home/HomeHeader";
import { StartAnalysisCard } from "@/components/home/StartAnalysisCard";
import { UsefulSections } from "@/components/home/UsefulSections";
import { Colors } from "@/constants/Colors";
import { useUserName } from "@/hooks/useUserName";

export default function HomeScreen() {
  const { userName, loadingName } = useUserName();
  const router = useRouter();

  const handleStartAnalysis = () => {
    console.log("Botão SIM para iniciar análise clicado");
    router.push("/acquisition");
  };

  const handleSettingsPress = () => {
    router.push("/settings");
    console.log("Botão de configurações - Pressionado");
  };

  const usefulSectionsData = [
    {
      id: "ar-scan",
      label: "AR Scan",
      iconName: "vr-cardboard",
      iconComponent: FontAwesome5,
      onPress: () => console.log("AR Scan Pressionado"),
    },
    {
      id: "test",
      label: "Test",
      iconName: "flask-outline",
      iconComponent: MaterialCommunityIcons,
      onPress: () => router.push("/test"),
    },
    {
      id: "doubts",
      label: "Dúvidas",
      iconName: "question",
      iconComponent: SimpleLineIcons,
      onPress: () => console.log("Dúvidas Pressionado"),
    },
    {
      id: "more",
      label: "Mais",
      iconName: "options",
      iconComponent: SimpleLineIcons,
      onPress: () => {
        console.log("Mais Opções Pressionado");
        router.push("/options");
      },
    },
  ];

  if (loadingName) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.tabActive} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <HomeHeader userName={userName} onSettingsPress={handleSettingsPress} />
        <StartAnalysisCard onPress={handleStartAnalysis} />
        <UsefulSections sections={usefulSectionsData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
