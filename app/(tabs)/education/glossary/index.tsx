import BackButton from "@/components/ui/BackButton";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const glossaryData = [
  {
    id: "1",
    term: "Absorbância",
    definition: "Medida da quantidade de luz absorvida por uma amostra em uma determinada faixa de comprimento de onda.",
  },
  {
    id: "2",
    term: "Transmitância",
    definition: "Fração da luz que passa através da amostra sem ser absorvida.",
  },
  {
    id: "3",
    term: "Espectro de Absorção",
    definition: "Gráfico que mostra a absorbância de uma substância em função do comprimento de onda da luz.",
  },
  {
    id: "4",
    term: "Curva de Calibração",
    definition: "Gráfico usado para determinar a concentração de uma substância com base na absorbância medida.",
  },
  {
    id: "5",
    term: "Cuveta",
    definition: "Pequeno recipiente onde a amostra é colocada para ser analisada pelo espectrofotômetro.",
  },
  {
    id: "6",
    term: "Espectrofotômetro",
    definition: "Equipamento utilizado para medir a quantidade de luz absorvida por uma amostra.",
  },
  {
    id: "7",
    term: "Comprimento de Onda",
    definition: "Distância entre dois picos consecutivos de uma onda; na espectrofotometria, define a cor da luz usada.",
  },
  {
    id: "8",
    term: "Lei de Beer-Lambert",
    definition: "Relação entre a absorbância de uma solução e sua concentração.",
  },
  {
    id: "9",
    term: "Branco",
    definition: "Amostra sem o analito de interesse, usada para zerar o instrumento e calibrar medidas.",
  },
  {
    id: "10",
    term: "Analito",
    definition: "Substância química que se deseja identificar ou quantificar em uma amostra.",
  },
];

type GlossaryItem = {
  id: string;
  term: string;
  definition: string;
};

export default function GlossaryListScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredData = glossaryData
    .filter((item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term));

  const renderItem = ({ item }: { item: GlossaryItem }) => {
    const isExpanded = expandedItems.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => toggleItem(item.id)}
      >
        <Text style={styles.term}>{item.term}</Text>
        {isExpanded && <Text style={styles.definition}>{item.definition}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Glossário de Termos</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar termo..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredData}
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
    color: "#2c3e50",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
  },
  item: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#e0e0e0",
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
    marginTop: 8,
  },
});