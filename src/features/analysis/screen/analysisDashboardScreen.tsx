import { Margin, Padding } from "@/constants/Styles";
import { INFO_CARD_DATA } from "@/data/analysisData";
import { useThemeValue } from "@/hooks/useThemeValue";
import AnalysisHeader from "@/src/components/analysis/dashboard/analysisHeader";
import ButtonFooter from "@/src/components/analysis/dashboard/ButtonFooter";
import CardMain from "@/src/components/analysis/dashboard/cardMain";
import { InfoCard } from "@/src/components/analysis/dashboard/InfoCard";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useUserName } from "@/store/userStore";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AnalysisPage() {
  const colorsGradient = useThemeValue("authGradient");
  const colorsBackground = useThemeValue("card");
  const name = useUserName();
  const handleMenuPress = () => {
    console.log("Menu button pressed");
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <LinearGradient colors={colorsGradient}>
        <AnalysisHeader handleMenuPress={handleMenuPress} name={name} />
        <CardMain />
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
