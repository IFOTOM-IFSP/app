import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChallengeListScreen() {
  const router = useRouter();

  const quizzes = [
    {
      id: "1",
      title: "Quiz Básico",
      description: "Teste seus conhecimentos fundamentais",
      difficulty: "Fácil"
    },
    {
      id: "2",
      title: "Quiz Intermediário",
      description: "Desafie seu conhecimento médio",
      difficulty: "Médio"
    },
    {
      id: "3",
      title: "Quiz Avançado",
      description: "Para especialistas no assunto",
      difficulty: "Difícil"
    }
  ];

  const handleQuizPress = (id: string) => {
    // Navega para a página do quiz específico
    router.push(`/quiz/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.title}>Desafios e Quizzes</Text>
      </View>

      <View style={styles.quizList}>
        {quizzes.map((quiz) => (
          <Pressable
            key={quiz.id}
            style={styles.quizCard}
            onPress={() => handleQuizPress(quiz.id)}
          >
            <View style={styles.quizHeader}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              <Text style={[
                styles.quizDifficulty,
                quiz.difficulty === "Fácil" && styles.easy,
                quiz.difficulty === "Médio" && styles.medium,
                quiz.difficulty === "Difícil" && styles.hard
              ]}>
                {quiz.difficulty}
              </Text>
            </View>
            <Text style={styles.quizDescription}>{quiz.description}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.accentPurple,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quizList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  quizCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  quizDifficulty: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  easy: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  medium: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  hard: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  quizDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});