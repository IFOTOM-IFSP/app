import { Colors } from "@/constants/Colors";
import { CodeContent } from "@/interfaces/content";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

export const CodeBlock: React.FC<{ block: CodeContent }> = ({ block }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.language}>{block.language}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.code}>{block.value}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  language: {
    color: "#9CDCFE",
    fontSize: 12,
    marginBottom: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  code: {
    color: "#D4D4D4",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 14,
    lineHeight: 21,
  },
});
