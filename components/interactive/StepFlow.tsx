// src/components/modulesPage/interactive/StepFlow.tsx

import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

type Step = { label: string; title: string; description: string };
type StepFlowProps = { title?: string; description?: string; steps: Step[] };

export const StepFlow: React.FC<StepFlowProps> = ({
  title,
  description,
  steps,
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.mainTitle}>{title}</Text>}
      {description && <Text style={styles.mainDescription}>{description}</Text>}
      <View>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
              {/* Linha conectora, não aparece no último item */}
              {index < steps.length - 1 && (
                <View style={styles.connectorLine} />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 16,
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.textPrimary,
    marginBottom: 4,
  },
  mainDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  stepContainer: { flexDirection: "row", alignItems: "flex-start" },
  stepIndicator: { alignItems: "center", marginRight: 16 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(107, 70, 193, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.accentPurple,
  },
  stepLabel: { color: theme.accentPurple, fontWeight: "bold" },
  connectorLine: {
    flex: 1,
    width: 2,
    backgroundColor: theme.accentPurple,
    marginVertical: 4,
  },
  stepContent: { flex: 1, paddingBottom: 24 },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 4,
  },
  stepDescription: { fontSize: 16, color: theme.textSecondary, lineHeight: 22 },
});
