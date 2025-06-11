import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

interface InteractiveCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.contentArea}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.borderColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: theme.textPrimary,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: theme.textSecondary,
    marginBottom: 24,
  },
  contentArea: {},
});
