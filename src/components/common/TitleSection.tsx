import BackButton from "@/src/components/ui/BackButton";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";

interface TitleSectionProps {
  title: string;
  subtitle?: string;
  routerPath?: string;
  style?: StyleProp<TextStyle>;
}
export default function TitleSection({
  title,
  subtitle,
  routerPath,
  style,
}: TitleSectionProps) {
  const titleColor = useThemeValue("text");
  const subtitleColor = useThemeValue("textSecondary");
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {routerPath ? <BackButton path={routerPath} /> : <BackButton />}
        <ThemedText style={[styles.title, { color: titleColor }, style]}>
          {title}
        </ThemedText>
      </View>
      {subtitle && (
        <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Padding.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Padding.sm,
    paddingBottom: Padding.sm,
  },
  title: {
    fontWeight: FontWeight.regular,
    flexGrow: 3 / 4,
    fontSize: FontSize.xxl,
  },
  subtitle: {
    fontSize: FontSize.sm,
  },
});
