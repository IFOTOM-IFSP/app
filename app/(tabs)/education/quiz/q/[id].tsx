import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import { Question, quizData } from "@/constants/quizData";
import { useQuizResults } from "@/hooks/useQuizResults";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addQuizResult } = useQuizResults();

  const [quiz, setQuiz] = useState(quizData.find((q) => q.id === id));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const currentQuestion: Question | undefined =
    quiz?.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / (quiz?.questions.length || 1)) * 100;

  useEffect(() => {
    if (!quiz) {
      Alert.alert("Erro", "Quiz não encontrado.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [quiz, router]);

  // Salva o resultado quando o quiz termina
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

  // Rola para a explicação quando a resposta é dada
  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAnswered]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOptionIndex(optionIndex);
    setIsAnswered(true);

    if (optionIndex === currentQuestion?.answerIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton />
        </View>
        <Text style={styles.loadingText}>Carregando quiz...</Text>
      </SafeAreaView>
    );
  }

  // --- Tela de Resultados ---
  if (quizFinished) {
    const score = (correctAnswersCount / quiz.questions.length) * 100;
    const resultMessage =
      score >= 80
        ? "Excelente!"
        : score >= 50
        ? "Bom trabalho!"
        : "Continue estudando!";

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsContainer}>
          <Feather name="award" size={80} color={Colors.light.accentPurple} />
          <Text style={styles.resultsTitle}>{resultMessage}</Text>
          <Text style={styles.resultsSubtitle}>Sua pontuação final foi:</Text>
          <Text style={styles.scoreText}>{score.toFixed(0)}%</Text>
          <Text style={styles.summaryText}>
            Você acertou {correctAnswersCount} de {quiz.questions.length}{" "}
            questões.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={restartQuiz}>
            <Text style={styles.primaryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Voltar aos Quizzes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Tela do Quiz Ativo ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.quizContent}
        contentContainerStyle={styles.quizContentContainer}>
        <Text style={styles.questionCounter}>
          Questão {currentQuestionIndex + 1} de {quiz.questions.length}
        </Text>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            const isCorrect = currentQuestion.answerIndex === index;
            let optionStyle: StyleProp<ViewStyle> = styles.optionButton;
            let textStyle: StyleProp<TextStyle> = styles.optionText;

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = [styles.optionButton, styles.correctOption];
                textStyle = [styles.optionText, styles.correctOptionText];
              } else if (isSelected) {
                optionStyle = [styles.optionButton, styles.incorrectOption];
                textStyle = [styles.optionText, styles.incorrectOptionText];
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleOptionSelect(index)}
                disabled={isAnswered}>
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isAnswered && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Explicação</Text>
            <Text style={styles.explanationText}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !isAnswered && styles.disabledButton]}
          onPress={handleNextQuestion}
          disabled={!isAnswered}>
          <Text style={styles.primaryButtonText}>
            {currentQuestionIndex === quiz.questions.length - 1
              ? "Finalizar"
              : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
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
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    marginLeft: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.light.accentPurple,
    borderRadius: 4,
  },
  quizContent: {
    flex: 1,
  },
  quizContentContainer: {
    padding: 20,
  },
  questionCounter: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  questionContainer: {
    backgroundColor: Colors.light.accentPurple,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 30,
  },
  optionsContainer: {
    marginVertical: 10,
  },
  optionButton: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#DEE2E6",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.light.text,
  },
  correctOption: {
    backgroundColor: "#D4EDDA",
    borderColor: "#28A745",
  },
  correctOptionText: {
    color: "#155724",
    fontWeight: "bold",
  },
  incorrectOption: {
    backgroundColor: "#F8D7DA",
    borderColor: "#DC3545",
  },
  incorrectOptionText: {
    color: "#721C24",
    fontWeight: "bold",
  },
  explanationBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#DEE2E6",
    backgroundColor: "#F8F9FA",
  },
  primaryButton: {
    backgroundColor: Colors.light.accentPurple,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#C1B2F3",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: Colors.light.textSecondary,
  },
  // --- Results Screen Styles ---
  resultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 24,
  },
  resultsSubtitle: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: "bold",
    color: Colors.light.accentPurple,
    marginVertical: 16,
  },
  summaryText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 32,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.light.accentPurple,
    fontSize: 18,
    fontWeight: "bold",
  },
});
