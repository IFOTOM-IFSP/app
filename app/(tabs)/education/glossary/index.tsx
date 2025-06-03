import React from "react";
import { StyleSheet, Text, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const glossaryData = [
  { id: "1", term: "Fotossíntese", definition: "Processo pelo qual plantas produzem energia a partir da luz solar." },
  { id: "2", term: "Clorofila", definition: "Pigmento verde das plantas responsável por absorver luz." },
  { id: "3", term: "Transpiração", definition: "Perda de água pelas folhas em forma de vapor." },
];

export default function GlossaryListScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.term}>{item.term}</Text>
      <Text style={styles.definition}>{item.definition}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
