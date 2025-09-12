import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { HomeHeader } from "@/components/home/HomeHeader";
import { StartAnalysisCard } from "@/components/home/StartAnalysisCard";
import { Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";

import {
  UsefulSections,
  UsefulSectionsProps,
} from "@/components/common/UsefulSections";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

type AppRouter = ReturnType<typeof useRouter>;
const getUsefulSectionsData = (router: AppRouter): UsefulSectionsProps => {
  return {
    sections: [
      {
        id: "espectrofototometros",
        label: "Espectrofotômetros",
        iconName: "camera-document",
        iconLibrary: "MaterialCommunityIcons",
        onPress: () => console.log("AR Scan Pressionado"),
      },
      {
        id: "about",
        label: "Guia rápido",
        iconName: "running",
        iconLibrary: "FontAwesome5",
        onPress: () => router.push("/about"),
      },
      {
        id: "doubts",
        label: "Dúvidas",
        iconName: "question",
        iconLibrary: "SimpleLineIcons",
        onPress: () => router.push("/doubts"),
      },
      {
        id: "more",
        label: "Mais",
        iconName: "options",
        iconLibrary: "SimpleLineIcons",
        onPress: () => router.push("/options"),
      },
    ],
    title: true,
  };
};

export default function HomeScreen() {
  const userName = useUserStore((state) => state.name);
  const loadingName = useUserStore((state) => state.isLoading);

  const router = useRouter();
  const backgroundColor = useThemeValue("background");
  const tintColor = useThemeValue("tint");
  const usefulSectionsData = getUsefulSectionsData(router);

  // const {
  //   notes,
  //   actions: noteActions,
  //   isLoading: notesLoading,
  // } = useNotesStore();
  // // const {
  // //   analyses,
  // //   actions: analysisActions,
  // //   isLoading: analysesLoading,
  // // } = useAnalysisStore();

  // useEffect(() => {
  //   noteActions.init();
  //   analysisActions.fetchAllAnalyses();
  // }, [analysisActions, noteActions]);

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
    <ScreenLayout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <HomeHeader userName={userName} onSettingsPress={handleSettingsPress} />
        <StartAnalysisCard
          href="/analysis"
          sharedTransitionTag="analysis-card-main"
        />
        <UsefulSections
          title={usefulSectionsData.title}
          sections={usefulSectionsData.sections}
        />
        {/* <HistoryToggleList
          notes={notes}
          analyses={analyses}
          isLoading={notesLoading || analysesLoading}
        /> */}
      </ScrollView>
    </ScreenLayout>
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
  },
  scrollContent: {
    paddingBottom: Padding.lg,
  },
});
