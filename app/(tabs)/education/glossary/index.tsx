import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const glossaryData = [
  {
    id: "1",
    term: "Absorbância",
    definition:
      "Medida da quantidade de luz absorvida por uma amostra em uma determinada faixa de comprimento de onda.",
  },
  {
    id: "2",
    term: "Transmitância",
    definition: "Fração da luz que passa através da amostra sem ser absorvida.",
  },
  {
    id: "3",
    term: "Espectro de Absorção",
    definition:
      "Gráfico que mostra a absorbância de uma substância em função do comprimento de onda da luz.",
  },
  {
    id: "4",
    term: "Curva de Calibração",
    definition:
      "Gráfico usado para determinar a concentração de uma substância com base na absorbância medida.",
  },
  {
    id: "5",
    term: "Cuveta",
    definition:
      "Pequeno recipiente onde a amostra é colocada para ser analisada pelo espectrofotômetro.",
  },
  {
    id: "6",
    term: "Espectrofotômetro",
    definition: "Equipamento utilizado para medir a quantidade de luz absorvida por uma amostra.",
  },
  {
    id: "7",
    term: "Comprimento de Onda",
    definition:
      "Distância entre dois picos consecutivos de uma onda; na espectrofotometria, define a cor da luz usada.",
  },
  {
    id: "8",
    term: "Lei de Beer-Lambert",
    definition:
      "Relação entre a absorbância de uma solução e sua concentração.",
  },
  {
    id: "9",
    term: "Branco",
    definition:
      "Amostra sem o analito de interesse, usada para zerar o instrumento e calibrar medidas.",
  },
  {
    id: "10",
    term: "Analito",
    definition:
      "Substância química que se deseja identificar ou quantificar em uma amostra.",
  },
  {
    id: "11",
    term: "Calibração",
    definition:
      "Processo de ajustar o equipamento para que suas medições sejam precisas e confiáveis.",
  },
  {
    id: "12",
    term: "Espectrofotometria UV-Vis",
    definition:
      "Técnica que utiliza luz ultravioleta e visível para analisar a absorção de amostras.",
  },
  {
    id: "13",
    term: "Diluição",
    definition:
      "Processo de reduzir a concentração de uma solução adicionando solvente.",
  },
  {
    id: "14",
    term: "Pico de Absorção",
    definition:
      "Ponto no espectro onde a absorbância é máxima para uma substância específica.",
  },
  {
    id: "15",
    term: "Linha de Base",
    definition:
      "Medida da absorbância em uma área do espectro onde não há absorção da amostra.",
  },
  {
    id: "16",
    term: "Espectro",
    definition:
      "Distribuição da intensidade da luz absorvida ou emitida por uma substância em função do comprimento de onda.",
  },
  {
    id: "17",
    term: "Fotodetector",
    definition:
      "Dispositivo que converte luz em sinal elétrico para medição no espectrofotômetro.",
  },
  {
    id: "18",
    term: "Monocromador",
    definition:
      "Componente que seleciona uma única faixa de comprimento de onda para análise.",
  },
  {
    id: "19",
    term: "Luz Visível",
    definition:
      "Faixa do espectro eletromagnético perceptível ao olho humano, entre 400 e 700 nm.",
  },
  {
    id: "20",
    term: "Solvente",
    definition:
      "Substância que dissolve o analito, formando uma solução para análise.",
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
      <TouchableOpacity style={styles.card} onPress={() => toggleItem(item.id)}>
        <Text style={styles.term}>{item.term}</Text>
        {isExpanded && (
          <View style={styles.definitionContainer}>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.title}>Glossário de Termos</Text>
      </View>

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
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.accentPurple,
  },
  searchInput: {
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#111827",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  term: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  definitionContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
  definition: {
    fontSize: 16,
    color: "#4b5563",
  },
});