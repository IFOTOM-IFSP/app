import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Image, StyleSheet, Text, View } from "react-native";

export function EducationHeroCard() {
  const accentColor = useThemeValue("switchTrackTrue");

  return (
    <View style={styles.heroCardContainer}>
      <View style={styles.heroTextContent}>
        <ThemedText style={styles.heroTitle}>
          Bem-vindo ao{" "}
          <Text style={{ color: accentColor }}>iFOTOM Aprender!</Text>
        </ThemedText>
      </View>
      <Image
        source={require("@/assets/images/education.png")}
        style={styles.heroIllustration}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroCardContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: Padding.xl,
    paddingVertical: Padding.md,
    marginTop: Margin.sm,
    paddingTop: Padding.xxl,
  },
  heroTextContent: {
    flex: 1,
    marginRight: Margin.sm,
  },
  heroTitle: {
    fontSize: FontSize.xxl + 10,
    fontWeight: FontWeight.bold,
    lineHeight: Spacing.xxl,
  },
  heroIllustration: {
    width: 150,
    height: 150,
  },
});
