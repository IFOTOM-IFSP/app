import BackButton from "@/components/ui/BackButton";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const glossaryData = [
  {
    id: "1",
    term: "Fotossíntese",
    definition:
      "Processo pelo qual plantas produzem energia a partir da luz solar.",
  },
  {
    id: "2",
    term: "Clorofila",
    definition: "Pigmento verde das plantas responsável por absorver luz.",
  },
  {
    id: "3",
    term: "Transpiração",
    definition: "Perda de água pelas folhas em forma de vapor.",
  },
];

type GlossaryItem = {
  id: string;
  term: string;
  definition: string;
};

export default function GlossaryListScreen() {
  const renderItem = ({ item }: { item: GlossaryItem }) => (
    <View style={styles.item}>
      <Text style={styles.term}>{item.term}</Text>
      <Text style={styles.definition}>{item.definition}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Glossário</Text>
      <FlatList
        data={glossaryData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007aff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  item: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  term: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  definition: {
    fontSize: 16,
    color: "#34495e",
    marginTop: 4,
  },
});
