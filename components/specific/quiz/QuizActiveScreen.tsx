import BackButton from "@/components/ui/BackButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { QuizOption } from "@/components/ui/QuizOption";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { Question, Quiz } from "@/data/quizData";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface QuizActiveScreenProps {
  quiz: Quiz;
  currentQuestion: Question;
  currentQuestionIndex: number;
  progress: number;
  isAnswered: boolean;
  selectedOptionIndex: number | null;
  handleOptionSelect: (index: number) => void;
  handleNextQuestion: () => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export function QuizActiveScreen({
  quiz,
  currentQuestion,
  currentQuestionIndex,
  progress,
  isAnswered,
  selectedOptionIndex,
  handleOptionSelect,
  handleNextQuestion,
  scrollViewRef,
}: QuizActiveScreenProps) {
  const accentColor = useThemeValue("accentPurple");
  const buttonText = useThemeValue("buttonText");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const progressBg = useThemeValue("progressBarBackground");
  const borderColor = useThemeValue("borderColor");
  const explanationBg = useThemeValue("blockquoteBackground");

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <View
          style={[styles.progressContainer, { backgroundColor: progressBg }]}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: accentColor },
            ]}
          />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.quizContent}
        contentContainerStyle={styles.quizContentContainer}
        showsVerticalScrollIndicator={false}>
        <ThemedText style={[styles.questionCounter, { color: textSecondary }]}>
          Questão {currentQuestionIndex + 1} de {quiz.questions.length}
        </ThemedText>
        <View
          style={[styles.questionContainer, { backgroundColor: accentColor }]}>
          <ThemedText style={[styles.questionText, { color: buttonText }]}>
            {currentQuestion.question}
          </ThemedText>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            const isCorrect = currentQuestion.answerIndex === index;
            const status = !isAnswered
              ? "default"
              : isCorrect
              ? "correct"
              : isSelected
              ? "incorrect"
              : "default";
            return (
              <QuizOption
                key={index}
                text={option}
                status={status}
                onPress={() => handleOptionSelect(index)}
                disabled={isAnswered}
              />
            );
          })}
        </View>

        {isAnswered && (
          <View
            style={[styles.explanationBox, { backgroundColor: explanationBg }]}>
            <ThemedText style={[styles.explanationTitle, { color: textColor }]}>
              Explicação
            </ThemedText>
            <ThemedText
              style={[styles.explanationText, { color: textSecondary }]}>
              {currentQuestion.explanation}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: borderColor }]}>
        <PrimaryButton
          title={
            currentQuestionIndex === quiz.questions.length - 1
              ? "Finalizar"
              : "Próximo"
          }
          onPress={handleNextQuestion}
          disabled={!isAnswered}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    paddingTop: Padding.xxl,
    paddingBottom: Padding.sm,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    borderRadius: BorderRadius.full,
    marginLeft: Margin.md,
  },
  progressBar: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  quizContent: {
    flex: 1,
  },
  quizContentContainer: {
    padding: Padding.xl,
  },
  questionCounter: {
    fontSize: FontSize.md,
    marginBottom: Margin.md,
    textAlign: "center",
    fontWeight: FontWeight.semiBold,
  },
  questionContainer: {
    borderRadius: BorderRadius.lg,
    padding: Padding.xl,
    marginBottom: Margin.lg,
  },
  questionText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: "center",
    lineHeight: 30,
  },
  optionsContainer: {
    marginVertical: Margin.sm,
  },
  explanationBox: {
    marginTop: Margin.xl,
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
  },
  explanationTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.sm,
  },
  explanationText: {
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  footer: {
    padding: Padding.xl,
    borderTopWidth: 1,
  },
});
