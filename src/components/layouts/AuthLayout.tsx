import { FontSize, FontWeight, Padding } from "@/constants/Styles";

import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/hooks/useThemeValue";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React, { JSX } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthLayoutProps {
  children: React.ReactNode;
  customGradientColors?: [string, string, ...string[]];
  gradientStart?: LinearGradientProps["start"];
  gradientEnd?: LinearGradientProps["end"];
  showFooter?: boolean;
}

export function AuthLayout({
  children,
  gradientStart = { x: 0.5, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  showFooter = true,
  customGradientColors,
}: AuthLayoutProps): JSX.Element {
  const themeGradient = useThemeValue("authGradient");
  const footerTextColor = useThemeValue("text");
  const finalGradientColors = customGradientColors || themeGradient;
  return (
    <LinearGradient
      colors={finalGradientColors}
      style={styles.gradientBackground}
      start={gradientStart}
      end={gradientEnd}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.outerContainer}>
          <View style={styles.contentArea}>{children}</View>

          {showFooter && (
            <View style={styles.footerView}>
              <ThemedText
                style={[styles.footerText, { color: footerTextColor }]}>
                IFSP - Campinas
              </ThemedText>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  outerContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Padding.xl,
    paddingTop: Platform.OS === "android" ? Padding.lg : Padding.xxl,
    paddingBottom: Platform.OS === "android" ? Padding.md : Padding.lg,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerView: {
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
  },
});
