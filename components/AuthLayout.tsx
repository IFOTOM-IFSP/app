import {
  BACKGROUND_COLOR_LIGHT,
  Colors,
  PRIMARY_COLOR_HEX,
  PRIMARY_COLOR_RGB,
} from "@/constants/Colors";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React, { JSX } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthLayoutProps {
  children: React.ReactNode;
  gradientColors?: string[];
  gradientStart?: LinearGradientProps["start"];
  gradientEnd?: LinearGradientProps["end"];
  showFooter?: boolean;
}

export function AuthLayout({
  children,
  gradientStart = { x: 0.5, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  showFooter = true,
}: AuthLayoutProps): JSX.Element {
  return (
    <LinearGradient
      colors={[
        PRIMARY_COLOR_HEX,
        PRIMARY_COLOR_RGB,
        BACKGROUND_COLOR_LIGHT,
        BACKGROUND_COLOR_LIGHT,
        BACKGROUND_COLOR_LIGHT,
      ]}
      style={styles.gradientBackground}
      start={gradientStart}
      end={gradientEnd}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.outerContainer}>
          <View style={styles.contentArea}>{children}</View>

          {showFooter && (
            <View style={styles.footerView}>
              <Text style={styles.footerText}>IFSP - Campinas</Text>
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
    justifyContent: "space-between", // Empurra o rodapé para baixo
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "android" ? 25 : 40,
    paddingBottom: Platform.OS === "android" ? 15 : 20,
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
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "600",
  },
});
