import FilterTabs from "@/components/common/FilterTabs";
import SearchComponent from "@/components/common/SearchComponent";
import ThemedFlatList from "@/components/common/ThemedFlatList";
import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { QuizListItem } from "@/components/specific/quiz/QuizListItem";
import { Margin } from "@/constants/Styles";
import { quizData } from "@/data/index";
import { useQuizResults } from "@/hooks/useQuizResults";
import { useThemeValue } from "@/hooks/useThemeValue";
import { moduleTitles } from "@/utils/module-helpers";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function QuizListScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos");
  const [selectedModule, setSelectedModule] = useState("Todos");
  const { highScores, refreshResults } = useQuizResults();

  const borderColor = useThemeValue("border");

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
    <ScreenLayout>
      <TitleSection title="Teste seus conhecimentos" />
      <SearchComponent
        placeholder="Buscar quizzes..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={[styles.filtersContainer, { borderColor: borderColor }]}>
        <FilterTabs<string>
          title="Filtrar por Módulo"
          data={modules}
          selectedValue={selectedModule}
          onSelect={setSelectedModule}
          getValue={(moduleId) => moduleId}
          getLabel={(moduleId) => moduleTitles[moduleId] || moduleId}
        />

        <FilterTabs<string>
          title="Filtrar por Dificuldade"
          data={difficulties}
          selectedValue={selectedDifficulty}
          onSelect={setSelectedDifficulty}
          getValue={(difficulty) => difficulty}
          getLabel={(difficulty) => difficulty}
        />
      </View>

      <ThemedFlatList<(typeof quizData)[0]>
        keyExtractor={(item) => `${item.title}-${item.id}`}
        data={filteredQuizzes}
        renderItem={({ item }) => (
          <QuizListItem item={item} highScore={highScores[item.id] || 0} />
        )}
        emptyMessage="Nenhum quiz encontrado."
        emptySubMessage="Tente ajustar sua busca ou filtros."
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    borderBottomWidth: 1,
    marginBottom: Margin.md,
  },
});
