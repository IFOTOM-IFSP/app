import { INFO_CARD_DATA } from "@/data/analysisData";
import AnalysisHeader from "@/src/components/analysis/dashboard/analysisHeader";
import ButtonFooter from "@/src/components/analysis/dashboard/ButtonFooter";
import CardMain from "@/src/components/analysis/dashboard/cardMain";
import { InfoCard } from "@/src/components/analysis/dashboard/InfoCard";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { Margin, Padding } from "@/src/constants/Styles";
import { useAnalysisMachine } from "@/src/features/analysis/AnalysisMachineProvider";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useUserName } from "@/src/store/userStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AnalysisPage() {
  const colorsGradient = useThemeValue("authGradient");
  const colorsBackground = useThemeValue("card");
  const name = useUserName();
  const router = useRouter();
  const { send } = useAnalysisMachine();

  const handleMenuPress = () => {
    console.log("Menu button pressed");
  };

  const startNewAnalysis = useCallback(() => {
    router.replace("/(tabs)/analysis/create/index");
    setTimeout(() => {
      send({ type: "RESET" });
    }, 0);
  }, [send, router]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <LinearGradient colors={colorsGradient}>
        <AnalysisHeader handleMenuPress={handleMenuPress} name={name} />
        <CardMain onPress={startNewAnalysis} />
      </LinearGradient>
      <ScrollView style={{ paddingHorizontal: Padding.lg }}>
        <View style={styles.gridContainer}>
          {INFO_CARD_DATA.map((item) => (
            <InfoCard
              title={item.title}
              subtitle={item.subtitle}
              largeNumber={item.largeNumber}
              smallIcon={item.smallIcon}
              route={item.route}
              key={item.title}
            />
          ))}
        </View>
        <ButtonFooter />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: Margin.md,
    width: "100%",
  },
});
