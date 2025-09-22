import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

import { HomeHeader } from "@/src/components/home/HomeHeader";
import { StartAnalysisCard } from "@/src/components/home/StartAnalysisCard";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { Padding } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";

import { Sections_Grid_DATA } from "@/data/SectionsGridData";
import { SectionsGrid } from "@/src/components/common/SectionsGrid";
import { useUserStore } from "@/src/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const userName = useUserStore((state) => state.name);
  const loadingName = useUserStore((state) => state.isLoading);

  const router = useRouter();
  const backgroundColor = useThemeValue("background");
  const tintColor = useThemeValue("tint");
  const items = Sections_Grid_DATA;

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
        <SectionsGrid title sections={items} variant="home" />
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
