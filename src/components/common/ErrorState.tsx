import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { FontSize, FontWeight, Margin, Padding } from "@/constants/Styles";
import React from "react";
import { StyleSheet } from "react-native";

interface ErrorStateProps {
  title: string;
  message: string;
  icon?: string;
}

export function ErrorState({ title, message, icon = "🚧" }: ErrorStateProps) {
  return (
    <ThemedView style={styles.centeredContainer}>
      <ThemedText style={styles.notFoundIcon}>{icon}</ThemedText>
      <ThemedText style={styles.heading1}>{title}</ThemedText>
      <ThemedText style={styles.errorCaption}>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.lg,
  },
  notFoundIcon: {
    fontSize: FontSize.displayLg,
    marginBottom: Margin.md,
  },
  heading1: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
    marginTop: Margin.md,
    textAlign: "center",
  },
  errorCaption: {
    fontSize: FontSize.sm,
    marginTop: Margin.sm,
    textAlign: "center",
  },
});
