import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";


import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Quiz } from "@/models";

interface QuizListItemProps {
  item: Quiz;
  highScore: number;
}

export function QuizListItem({ item, highScore }: QuizListItemProps) {
  const cardBg = useThemeValue("card");
  const borderColor = useThemeValue("border");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const buttonText = useThemeValue("buttonText");

  const difficultyColors = {
    Fácil: useThemeValue("difficultyEasy"),
    Médio: useThemeValue("difficultyMedium"),
    Difícil: useThemeValue("difficultyHard"),
  };
  const badgeColor = difficultyColors[item.difficulty];

  return (
    <Link
      href={{
        pathname: "/(tabs)/education/quiz/q/[id]",
        params: { id: item.id },
      }}
      asChild>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor,
            shadowColor: useThemeValue("shadow"),
          },
        ]}
        accessibilityLabel={`${item.title}, Dificuldade: ${item.difficulty}, Melhor pontuação: ${highScore}%`}>
        <View style={styles.cardHeader}>
          <ThemedText style={[styles.cardTitle, { color: textColor }]}>
            {item.title}
          </ThemedText>
          <View
            style={[styles.difficultyBadge, { backgroundColor: badgeColor }]}>
            <ThemedText style={[styles.difficultyText, { color: buttonText }]}>
              {item.difficulty}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.cardDescription, { color: textSecondary }]}>
          {item.description}
        </ThemedText>
        <View style={[styles.cardFooter, { borderTopColor: borderColor }]}>
          <Feather name="bar-chart-2" size={16} color={textSecondary} />
          <ThemedText style={[styles.highScoreText, { color: textSecondary }]}>
            Melhor pontuação: {highScore.toFixed(0)}%
          </ThemedText>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Margin.md,
    width: "90%",
    padding: Padding.md,
    borderWidth: 1,
    paddingHorizontal: Padding.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Margin.sm,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    flex: 1,
    marginRight: Margin.sm,
  },
  difficultyBadge: {
    paddingVertical: Padding.xs,
    paddingHorizontal: Padding.sm,
    borderRadius: BorderRadius.full,
  },
  difficultyText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  cardDescription: {
    fontSize: FontSize.sm,
    marginBottom: Margin.md,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingTop: Padding.sm,
    marginBottom: Margin.md,
    paddingBottom: Padding.md,
  },
  highScoreText: {
    fontSize: FontSize.sm,
    marginLeft: Margin.sm,
    fontWeight: FontWeight.medium,
  },
});
