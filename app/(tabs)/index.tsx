import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { HomeHeader } from "@/src/components/home/HomeHeader";
import { StartAnalysisCard } from "@/src/components/home/StartAnalysisCard";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { Padding } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";

import { Sections_Grid_DATA } from "@/data/SectionsGridData";
import { SectionsGrid } from "@/src/components/common/SectionsGrid";
import { RecentActivity } from "@/src/components/home/RecentActivity";
import { useNotesStore } from "@/src/store/notesStore";
import { useUserStore } from "@/src/store/userStore";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const userName = useUserStore((state) => state.name);
  const loadingName = useUserStore((state) => state.isLoading);

  const router = useRouter();
  const backgroundColor = useThemeValue("background");
  const tintColor = useThemeValue("tint");
  const items = Sections_Grid_DATA;

  const {
    notes,
    actions: noteActions,
    isLoading: notesLoading,
  } = useNotesStore();
  // // const {
  // //   analyses,
  // //   actions: analysisActions,
  // //   isLoading: analysesLoading,
  // // } = useAnalysisStore();

  useEffect(() => {
    noteActions.init();
    //   analysisActions.fetchAllAnalyses();
  }, [noteActions]);

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
      <View style={styles.container}>
        <HomeHeader userName={userName} onSettingsPress={handleSettingsPress} />
        <StartAnalysisCard
          href="/analysis"
          sharedTransitionTag="analysis-card-main"
        />
        <SectionsGrid title sections={items} variant="home" />
        <RecentActivity notes={notes} isLoading={notesLoading} />
      </View>
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
