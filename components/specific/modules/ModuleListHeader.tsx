import BackButton from "@/components/ui/BackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface ModuleListHeaderProps {
  title?: string;
}

export default function ModuleListHeader({ title }: ModuleListHeaderProps) {
  const backgroundColor = useThemeValue("background");
  const shadowColor = useThemeValue("shadowColor");
  const tintColor = useThemeValue("tint");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, shadowColor, borderBottomColor: "transparent" },
      ]}>
      <BackButton />
      <View style={styles.contentWrapper}>
        {title && (
          <ThemedText style={[styles.title, { color: tintColor }]}>
            {" "}
            {title}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? Padding.xxxxl : Padding.xxxxl,
    paddingBottom: Padding.md,
    paddingHorizontal: Padding.xl,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderBottomWidth: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: Padding.sm,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
});
