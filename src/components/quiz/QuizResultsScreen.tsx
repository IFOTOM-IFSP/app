import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { FontSize, FontWeight, Margin, Padding } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

interface QuizResultsScreenProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
  onGoBack: () => void;
}

export function QuizResultsScreen({
  score,
  correctCount,
  totalQuestions,
  onRestart,
  onGoBack,
}: QuizResultsScreenProps) {
  const accentColor = useThemeValue("primary");
  const textColor = useThemeValue("text");
  const textSecondaryColor = useThemeValue("textSecondary");

  const resultMessage =
    score >= 80
      ? "Excelente!"
      : score >= 50
      ? "Bom trabalho!"
      : "Continue estudando!";

  return (
    <ThemedView style={styles.resultsContainer}>
      <Feather name="award" size={80} color={accentColor} />
      <ThemedText style={[styles.resultsTitle, { color: textColor }]}>
        {resultMessage}
      </ThemedText>
      <ThemedText
        style={[styles.resultsSubtitle, { color: textSecondaryColor }]}>
        Sua pontuação final foi:
      </ThemedText>
      <ThemedText style={[styles.scoreText, { color: accentColor }]}>
        {score.toFixed(0)}%
      </ThemedText>
      <ThemedText style={[styles.summaryText, { color: textSecondaryColor }]}>
        Você acertou {correctCount} de {totalQuestions} questões.
      </ThemedText>
      <Button
        title="Tentar Novamente"
        onPress={onRestart}
        style={{ marginBottom: Margin.sm }}
      />
      <Button title="Voltar aos Quizzes" onPress={onGoBack} variant="outline" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Padding.xl,
  },
  resultsTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginTop: Margin.lg,
  },
  resultsSubtitle: {
    fontSize: FontSize.lg,
    marginTop: Margin.sm,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: FontWeight.bold,
    marginVertical: Margin.md,
  },
  summaryText: {
    fontSize: FontSize.md,
    marginBottom: Margin.xl,
  },
});
