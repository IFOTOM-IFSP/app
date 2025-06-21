// Localização: src/app/(tabs)/education/quiz/index.tsx

import { QuizListItem } from "@/components/specific/quiz/QuizListItem";
import BackButton from "@/components/ui/BackButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { quizData } from "@/data/quizData";
import { useQuizResults } from "@/hooks/useQuizResults";
import { useThemeValue } from "@/hooks/useThemeValue";
import { moduleTitles } from "@/utils/module-helpers";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function QuizListScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos");
  const [selectedModule, setSelectedModule] = useState("Todos");
  const { highScores, refreshResults } = useQuizResults();

  // Cores do tema
  const bgColor = useThemeValue("background");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const cardBg = useThemeValue("cardBackground");
  const borderColor = useThemeValue("borderColor");
  const accentColor = useThemeValue("accentPurple");
  const buttonText = useThemeValue("buttonText");

  useFocusEffect(
    useCallback(() => {
      refreshResults();
    }, [refreshResults])
  );

  const difficulties = ["Todos", "Fácil", "Médio", "Difícil"];
  const modules = useMemo(
    () => ["Todos", ...Array.from(new Set(quizData.map((q) => q.moduleId)))],
    []
  );

  const filteredQuizzes = useMemo(() => {
    return quizData.filter((quiz) => {
      const themeMatch =
        selectedDifficulty === "Todos" ||
        quiz.difficulty === selectedDifficulty;
      const moduleMatch =
        selectedModule === "Todos" || quiz.moduleId === selectedModule;
      const searchMatch = quiz.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return themeMatch && moduleMatch && searchMatch;
    });
  }, [searchTerm, selectedDifficulty, selectedModule]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <BackButton />
        <ThemedText style={[styles.title, { color: textColor }]}>
          Testes de Conhecimento
        </ThemedText>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: cardBg, borderColor },
        ]}>
        <Feather name="search" size={20} color={textSecondary} />
        <ThemedInput
          style={styles.searchInput}
          placeholder="Buscar quiz..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.filtersContainer}>
        <ThemedText
          style={[styles.filterSectionTitle, { color: textSecondary }]}>
          Filtrar por Tópico
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {modules.map((moduleId) => {
            const isActive = selectedModule === moduleId;
            return (
              <TouchableOpacity
                key={moduleId}
                style={[
                  styles.filterButton,
                  { backgroundColor: cardBg, borderColor },
                  isActive && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                ]}
                onPress={() => setSelectedModule(moduleId)}>
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    { color: isActive ? buttonText : textColor },
                  ]}>
                  {moduleTitles[moduleId] || moduleId}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <ThemedText style={styles.filterSectionTitle}>
          Filtrar por Dificuldade
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {difficulties.map((difficulty) => {
            const isActive = selectedDifficulty === difficulty;
            return (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  { backgroundColor: cardBg, borderColor },
                  isActive && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}>
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    { color: isActive ? buttonText : textColor },
                  ]}>
                  {difficulty}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredQuizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuizListItem item={item} highScore={highScores[item.id] || 0} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: textColor }]}>
              Nenhum quiz encontrado.
            </ThemedText>
            <ThemedText style={[styles.emptySubText, { color: textSecondary }]}>
              Tente ajustar sua busca ou filtros.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    paddingTop: Padding.xxl,
    paddingBottom: Padding.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginLeft: Margin.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Margin.md,
    paddingHorizontal: Padding.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Margin.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    marginLeft: Margin.sm,
    borderWidth: 0,
    paddingVertical: Padding.sm,
    textAlign: "left",
  },
  filtersContainer: { paddingTop: Margin.md },
  filterSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    marginHorizontal: Margin.md,
    marginBottom: Margin.sm,
  },
  filterScroll: { paddingHorizontal: Padding.md, paddingBottom: Margin.md },
  filterButton: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.md,
    borderRadius: BorderRadius.full,
    marginRight: Margin.sm,
    borderWidth: 1,
  },
  filterButtonText: { fontWeight: FontWeight.semiBold },
  list: { paddingHorizontal: Padding.md, paddingBottom: Padding.lg },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: Padding.xl,
  },
  emptyText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  emptySubText: {
    fontSize: FontSize.sm,
    marginTop: Margin.sm,
    textAlign: "center",
  },
});
