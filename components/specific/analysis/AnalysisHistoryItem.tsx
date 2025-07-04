// Localização: src/components/specific/analysis/AnalysisHistoryItem.tsx

import { ThemedText } from "@/components/ui/ThemedText";
import {
  // BorderRadius não é mais necessário para este estilo
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { SavedAnalysis } from "@/storage/analysisStorage";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface AnalysisHistoryItemProps {
  item: SavedAnalysis;
}

export function AnalysisHistoryItem({ item }: AnalysisHistoryItemProps) {
  const borderColor = useThemeValue("border");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");

  const formattedDate = new Date(item.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const resultPath = `/analysis/${item.id}`;

  return (
    <Link href={resultPath} asChild>
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderColor: borderColor,
          },
        ]}>
        <View style={styles.contentWrapper}>
          <View style={styles.infoContainer}>
            <Feather
              name="bar-chart-2"
              size={24}
              color={accentColor}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <ThemedText
                style={[styles.title, { color: textColor }]}
                numberOfLines={2}>
                {item.analysisSetup.analysisName}
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
                Analito: {item.analysisSetup.analyteName}
              </ThemedText>
              <ThemedText style={[styles.date, { color: textSecondary }]}>
                {formattedDate}
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color={textSecondary} />
        </View>
        <View style={[styles.footer, { borderColor: borderColor }]}></View>
      </TouchableOpacity>
    </Link>
  );
}

// --- ESTILOS AJUSTADOS PARA TER APENAS BORDA INFERIOR ---
const styles = StyleSheet.create({
  card: {
    paddingVertical: Padding.lg,
    paddingHorizontal: Padding.md,

    borderBottomWidth: 1,
  },
  contentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Margin.md,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: Margin.sm,
  },
  icon: {
    marginRight: Margin.md,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: Margin.xs,
  },
  date: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: Margin.sm, // Adicionado espaço acima da data
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: Padding.md,
  },
});
