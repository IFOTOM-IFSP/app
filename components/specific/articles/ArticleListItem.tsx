import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { Article } from "@/data/articleData";
import { useThemeValue } from "@/hooks/useThemeValue";
import { openURL } from "@/utils/linkingUtils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ArticleListItemProps {
  item: Article;
}

export function ArticleListItem({ item }: ArticleListItemProps) {
  const cardBg = useThemeValue("cardBackground");
  const borderColor = useThemeValue("borderColor");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const tintColor = useThemeValue("tint");

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor,
          shadowColor: useThemeValue("shadowColor"),
        },
      ]}
      onPress={() => openURL(item.url)}
      accessibilityLabel={`Abrir artigo: ${item.title}`}>
      <ThemedText style={[styles.journal, { color: tintColor }]}>
        {item.journal}
      </ThemedText>
      <ThemedText style={[styles.title, { color: textColor }]}>
        {item.title}
      </ThemedText>
      <ThemedText style={[styles.summary, { color: textSecondary }]}>
        {item.summary}
      </ThemedText>
      <View style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: tintColor }]}>
          Ler artigo
        </ThemedText>
        <Ionicons name="open-outline" size={16} color={tintColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Padding.lg,
    marginBottom: Margin.md,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  journal: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: "uppercase",
    marginBottom: Margin.xs,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.sm,
  },
  summary: {
    fontSize: FontSize.sm,
    lineHeight: 22,
    marginBottom: Margin.md,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
  },
});
