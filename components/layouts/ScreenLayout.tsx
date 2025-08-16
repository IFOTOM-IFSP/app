import { Padding } from "@/constants/Styles";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "../ui/ThemedView";

interface ScreenLayoutProps {
  children: React.ReactNode;
}
export function ScreenLayout({ children }: ScreenLayoutProps) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Padding.lg,
    paddingTop: Padding.lg,
    paddingBottom: Padding.sm,
  },
});
