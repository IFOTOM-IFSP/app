import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StartAnalysisCardProps {
  onPress: () => void;
}

export function StartAnalysisCard({ onPress }: StartAnalysisCardProps) {
  const gradientColors = useThemeValue("cardGradient");
  const buttonBackgroundColor = useThemeValue("primary");
  const shadowColor = useThemeValue("shadow");
  const featuredCardTextColor = useThemeValue("textWhite");
  const buttonTextColor = useThemeValue("buttonText");
  const borderColor = useThemeValue("border");
  return (
    <TouchableOpacity
      style={[styles.cardTouchable, { shadowColor, borderColor }]}
      onPress={onPress}
      activeOpacity={0.85}>
      <LinearGradient
        colors={gradientColors}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={[styles.cardText, { color: featuredCardTextColor }]}>
          Quer começar uma análise?
        </Text>
        <View
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}>
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            SIM
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardTouchable: {
    height: 200,
    marginBottom: Margin.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
  },
  cardGradient: {
    flex: 1,
    paddingVertical: Padding.xl,
    paddingHorizontal: Padding.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: FontSize.displaySm,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.lg,
  },
  button: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.xl,
    borderRadius: BorderRadius.xl,
    elevation: 1,
    alignSelf: "flex-end",
  },
  buttonText: {
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
});
