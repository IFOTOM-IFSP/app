import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { StyleSheet, View } from "react-native";

type Step = { label: string; title: string; description: string };
type StepFlowProps = { title?: string; description?: string; steps: Step[] };

export function StepFlow({ title, description, steps }: StepFlowProps) {
  const cardBg = useThemeValue("card");
  const primaryText = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");
  const buttonText = useThemeValue("buttonText");

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      {title && (
        <ThemedText style={[styles.mainTitle, { color: primaryText }]}>
          {title}
        </ThemedText>
      )}
      {description && (
        <ThemedText style={[styles.mainDescription, { color: secondaryText }]}>
          {description}
        </ThemedText>
      )}

      <View>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepIndicator}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: `${accentColor}20`,
                    borderColor: accentColor,
                  },
                ]}>
                <ThemedText style={[styles.stepLabel, { color: accentColor }]}>
                  {step.label}
                </ThemedText>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connectorLine,
                    { backgroundColor: accentColor },
                  ]}
                />
              )}
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={[styles.stepTitle, { color: primaryText }]}>
                {step.title}
              </ThemedText>
              <ThemedText
                style={[styles.stepDescription, { color: secondaryText }]}>
                {step.description}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Padding.md,
    marginVertical: Margin.md,
    borderRadius: 10,
  },
  mainTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.xs,
  },
  mainDescription: {
    fontSize: FontSize.sm,
    marginBottom: Margin.xl,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: Margin.md,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  stepLabel: {
    fontWeight: FontWeight.bold,
  },
  connectorLine: {
    flex: 1,
    width: 2,
    marginVertical: Spacing.xs,
  },
  stepContent: {
    flex: 1,
    paddingBottom: Padding.lg,
  },
  stepTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.xs,
  },
  stepDescription: {
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
});
