import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { AnalysisType } from "@/schema/analysisSchema";
import { useRouter } from "expo-router";
import {
  Beaker,
  ChevronRight,
  FlaskConical,
  ScanLine,
  Timer,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const analysisOptions = [
  {
    type: "quantitative" as AnalysisType,
    title: "Análise Quantitativa",
    description: "Determine a concentração de uma amostra.",
    icon: FlaskConical,
  },
  {
    type: "scan" as AnalysisType,
    title: "Varredura Espectral",
    description: "Obtenha o espectro e identifique o λ máximo.",
    icon: ScanLine,
  },
  {
    type: "kinetic" as AnalysisType,
    title: "Análise Cinética",
    description: "Estude a velocidade de uma reação ao longo do tempo.",
    icon: Timer,
  },
  {
    type: "simple_read" as AnalysisType,
    title: "Leitura Simples",
    description: "Meça a absorbância em um λ específico.",
    icon: Beaker,
  },
];

export default function SelectAnalysisTypeScreen() {
  const router = useRouter();
  const cardBackgroundColor = useThemeValue("card");
  const borderColor = useThemeValue("border");
  const textColor = useThemeValue("text");
  const textSecondaryColor = useThemeValue("textSecondary");

  const handleSelectOption = (type: AnalysisType) => {
    router.push({
      pathname: "/analysis/setup",
      params: { type },
    });
  };

  return (
    <ScreenLayout>
      <TitleSection
        title="Selecione um tipo"
        subtitle="Qual tipo de análise você deseja realizar?"
      />

      {analysisOptions.map((option) => (
        <TouchableOpacity
          key={option.type}
          onPress={() => handleSelectOption(option.type)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${option.title}. ${option.description}`}
          accessibilityHint={`Toque para iniciar uma ${option.title}`}
          style={[
            styles.card,
            { backgroundColor: cardBackgroundColor, borderColor },
          ]}>
          <View style={styles.cardIcon}>
            <option.icon size={28} color={textColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <ThemedText style={styles.cardTitle}>{option.title}</ThemedText>
            <ThemedText
              style={[styles.cardDescription, { color: textSecondaryColor }]}>
              {option.description}
            </ThemedText>
          </View>
          <ChevronRight size={24} color={textSecondaryColor} />
        </TouchableOpacity>
      ))}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Padding.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Margin.md,
    marginTop: Margin.sm,
    borderWidth: 1,
  },
  cardIcon: {
    marginRight: Margin.lg,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  cardDescription: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
});
