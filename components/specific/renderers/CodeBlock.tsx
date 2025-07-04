import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { CodeContent } from "@/schema/contentSchema";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

export function CodeBlock({ block }: { block: CodeContent }) {
  const backgroundColor = useThemeValue("card");
  const langColor = useThemeValue("textSecondary");
  const codeColor = useThemeValue("secondary");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText style={[styles.language, { color: langColor }]}>
        {block.language}
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <ThemedText style={[styles.code, { color: codeColor }]}>
          {block.value}
        </ThemedText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Padding.md,
    marginBottom: Margin.lg,
  },
  language: {
    fontSize: FontSize.xs,
    marginBottom: Margin.sm,
    textTransform: "uppercase",
    fontWeight: FontWeight.bold,
  },
  code: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: FontSize.sm,
    lineHeight: Spacing.xl,
  },
});
