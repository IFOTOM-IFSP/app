import { useThemeValue } from "@/src/hooks/useThemeValue";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface EducationLayoutProps {
  children: React.ReactNode;
}

export function EducationLayout({ children }: EducationLayoutProps) {
  const primaryColor = useThemeValue("tint");
  const backgroundColor = useThemeValue("background");

  return (
    <LinearGradient
      colors={[primaryColor, backgroundColor, backgroundColor]}
      style={styles.gradientBackground}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 0.0, y: 0.4 }}>
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
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
});
