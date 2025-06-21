// Localização: src/app/(tabs)/education/quiz/q/[id].tsx

import { QuizActiveScreen } from "@/components/specific/quiz/QuizActiveScreen";
import { QuizResultsScreen } from "@/components/specific/quiz/QuizResultsScreen";
import BackButton from "@/components/ui/BackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Padding } from "@/constants/Styles";
import { useQuizActions } from "@/context/quizStore";
import { quizData } from "@/data/quizData";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

export default function QuizScreen() {
  // --- LÓGICA DE ESTADO COMPLETA ---
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // 2. MUDANÇA: Usa a ação da quizStore em vez do hook useQuizResults
  const { addQuizResult } = useQuizActions();

  const [quiz, setQuiz] = useState(() => quizData.find((q) => q.id === id));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const currentQuestion = quiz?.questions[currentQuestionIndex];

  // --- EFEITOS E MANIPULADORES COMPLETOS ---

  // Efeito para lidar com quiz não encontrado
  useEffect(() => {
    if (!quiz) {
      Alert.alert("Erro", "Quiz não encontrado.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [quiz, router]);

  // Efeito para salvar o resultado quando o quiz termina
  useEffect(() => {
    if (quizFinished && quiz) {
      const score = (correctAnswersCount / quiz.questions.length) * 100;
      addQuizResult({
        quizId: quiz.id,
        score: score,
        completedAt: new Date().toISOString(),
      });
    }
  }, [quizFinished, quiz, correctAnswersCount, addQuizResult]);

  // Efeito para rolar para a explicação após a resposta
  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAnswered]);

  // Função para lidar com a seleção de uma opção
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOptionIndex(optionIndex);
    setIsAnswered(true);

    if (optionIndex === currentQuestion?.answerIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  // Função para avançar para a próxima questão ou finalizar
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setCorrectAnswersCount(0);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  if (!quiz || !currentQuestion) {
    return (
      <ThemedView style={styles.container}>
        <BackButton />
        <ThemedText>Carregando quiz...</ThemedText>
      </ThemedView>
    );
  }

  if (quizFinished) {
    return (
      <QuizResultsScreen
        score={(correctAnswersCount / quiz.questions.length) * 100}
        correctCount={correctAnswersCount}
        totalQuestions={quiz.questions.length}
        onRestart={restartQuiz}
        onGoBack={() => router.back()}
      />
    );
  }

  return (
    <QuizActiveScreen
      quiz={quiz}
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      progress={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
      isAnswered={isAnswered}
      selectedOptionIndex={selectedOptionIndex}
      handleOptionSelect={handleOptionSelect}
      handleNextQuestion={handleNextQuestion}
      scrollViewRef={scrollViewRef}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
});
