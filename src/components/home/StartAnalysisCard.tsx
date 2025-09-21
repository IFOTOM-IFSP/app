import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

interface StartAnalysisCardProps {
  href: string;
  sharedTransitionTag: string;
}

export function StartAnalysisCard({
  href,
  sharedTransitionTag,
}: StartAnalysisCardProps) {
  const gradientColors = useThemeValue("cardGradient");
  const buttonBackgroundColor = useThemeValue("primary");
  const shadowColor = useThemeValue("shadow");
  const featuredCardTextColor = useThemeValue("textWhite");
  const buttonTextColor = useThemeValue("buttonText");
  const appBackgroundColor = useThemeValue("background");

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(href)}
      style={[styles.cardContainer, { shadowColor }]}>
      <Animated.View
        style={[styles.cardContainer, { shadowColor }]}
        sharedTransitionTag={sharedTransitionTag}>
        <LinearGradient
          colors={gradientColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View>
            <Text style={[styles.mainText, { color: featuredCardTextColor }]}>
              Quer começar uma análise?
            </Text>
            <Text style={[styles.subText, { color: featuredCardTextColor }]}>
              +$$% de precisão
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <View>
              <Text
                style={[styles.infoLabel, { color: featuredCardTextColor }]}>
                Tipo
              </Text>
              <Text
                style={[styles.infoValue, { color: featuredCardTextColor }]}>
                Espectro
              </Text>
            </View>
            <View>
              <Text
                style={[styles.infoLabel, { color: featuredCardTextColor }]}>
                Precisão
              </Text>
              <Text
                style={[styles.infoValue, { color: featuredCardTextColor }]}>
                $$%
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View
          style={[styles.cutoutCorner, { backgroundColor: appBackgroundColor }]}
        />
        <View
          style={[
            styles.button,
            { backgroundColor: buttonBackgroundColor, shadowColor },
          ]}>
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            Analisar
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 200,
    marginBottom: Margin.lg,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  cardGradient: {
    flex: 1,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    padding: Padding.lg,
    justifyContent: "space-between",
  },
  mainText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  subText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  bottomSection: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    opacity: 0.7,
    marginBottom: Spacing.xs / 2,
  },
  infoValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  cutoutCorner: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "36%",
    height: 60,
    borderTopLeftRadius: BorderRadius.lg + 5,
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingVertical: Padding.md,
    paddingHorizontal: Padding.xl,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: FontWeight.medium,
    fontSize: FontSize.md,
  },
});
