import TitleSection from "@/components/common/TitleSection";
import { ThemedView } from "@/components/ui/ThemedView";
import { Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { Platform, StyleSheet } from "react-native";

interface ModuleListHeaderProps {
  title?: string;
}

export default function ModuleListHeader({ title }: ModuleListHeaderProps) {
  const backgroundColor = useThemeValue("background");
  const shadowColor = useThemeValue("shadow");
  const tintColor = useThemeValue("tint");

  return (
    <ThemedView
      style={[
        styles.container,
        { shadowColor, borderBottomColor: "transparent" },
      ]}>
      <TitleSection title={title || "Módulos de Aprendizado"} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? Padding.md : Padding.md,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderBottomWidth: 1,
  },
});
