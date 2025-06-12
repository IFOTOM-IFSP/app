import { Feather } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import { Quiz, quizData } from "@/constants/quizData";
import { useQuizResults } from "@/hooks/useQuizResults";

// Mapeamento de cores para os níveis de dificuldade
const difficultyColors = {
  Fácil: "#28A745",
  Médio: "#FFC107",
  Difícil: "#DC3545",
};

// Mapeamento dos IDs dos módulos para títulos legíveis
const moduleTitles: { [key: string]: string } = {
  "1": "Introdução",
  "2": "Luz e Matéria",
  "3": "Lei de Beer-Lambert",
  "4": "Instrumentação",
  "5": "Tipos de Análise",
  "6": "Preparo de Soluções",
  "7": "Interpretação",
};

export default function QuizListScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos");
  const [selectedModule, setSelectedModule] = useState("Todos");

  const { highScores, refreshResults } = useQuizResults();

  useFocusEffect(
    useCallback(() => {
      refreshResults();
    }, [refreshResults])
  );

  // Extrai as opções de filtro dos dados
  const difficulties = ["Todos", "Fácil", "Médio", "Difícil"];
  const modules = useMemo(() => {
    const moduleIds = Array.from(new Set(quizData.map((q) => q.moduleId)));
    return ["Todos", ...moduleIds];
  }, []);

  // Filtra os quizzes com base na busca, dificuldade e módulo
  const filteredQuizzes = useMemo(() => {
    return quizData.filter((quiz) => {
      const difficultyMatch =
        selectedDifficulty === "Todos" ||
        quiz.difficulty === selectedDifficulty;
      const moduleMatch =
        selectedModule === "Todos" || quiz.moduleId === selectedModule;
      const searchMatch = quiz.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return difficultyMatch && moduleMatch && searchMatch;
    });
  }, [searchTerm, selectedDifficulty, selectedModule]);

  const renderQuizItem = ({ item }: { item: Quiz }) => {
    const highScore = highScores[item.id] || 0;

    return (
      <Link
        href={{
          pathname: "/(tabs)/education/quiz/q/[id]",
          params: { id: item.id },
        }}
        asChild>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: difficultyColors[item.difficulty] },
              ]}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <Feather
              name="bar-chart-2"
              size={16}
              color={Colors.light.textSecondary}
            />
            <Text style={styles.highScoreText}>
              Melhor pontuação: {highScore.toFixed(0)}%
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Testes de Conhecimento</Text>
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.light.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar quiz..."
          placeholderTextColor={Colors.light.textSecondary}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Container de Filtros */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterSectionTitle}>Filtrar por Tópico</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {modules.map((moduleId) => (
            <TouchableOpacity
              key={moduleId}
              style={[
                styles.filterButton,
                selectedModule === moduleId && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedModule(moduleId)}>
              <Text
                style={[
                  styles.filterButtonText,
                  selectedModule === moduleId && styles.filterButtonTextActive,
                ]}>
                {moduleTitles[moduleId] || moduleId}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterSectionTitle}>Filtrar por Dificuldade</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.filterButton,
                selectedDifficulty === difficulty && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedDifficulty(difficulty)}>
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === difficulty &&
                    styles.filterButtonTextActive,
                ]}>
                {difficulty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredQuizzes}
        keyExtractor={(item) => item.id}
        renderItem={renderQuizItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum quiz encontrado.</Text>
            <Text style={styles.emptySubText}>
              Tente ajustar sua busca ou filtros.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginLeft: 8,
    color: Colors.light.text,
  },
  filtersContainer: {
    paddingTop: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: {
    backgroundColor: Colors.light.accentPurple,
    borderColor: Colors.light.accentPurple,
  },
  filterButtonText: {
    color: Colors.light.text,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#FFF",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  difficultyText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  highScoreText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 8,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
});
