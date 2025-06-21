import ReferenceCard from "@/components/specific/references/ReferenceCard";
import BackButton from "@/components/ui/BackButton";
import { ThemedInput } from "@/components/ui/ThemedInput"; // Importe ThemedInput
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles"; // Importe BorderRadius
import { referencesData } from "@/data/referencesData"; // Importa referencesData e ReferenceType
import { useThemeValue } from "@/hooks/useThemeValue";
import { ReferenceType } from "@/interfaces/reference";
import { Feather } from "@expo/vector-icons"; // Importe Feather para o ícone de busca
import React, { useMemo, useState } from "react"; // Importe useState e useMemo
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"; // Importe ScrollView e TouchableOpacity

export default function ReferencesScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ReferenceType | "Todos">(
    "Todos"
  ); // Novo estado para o tipo de filtro

  const bgColor = useThemeValue("background");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const cardBg = useThemeValue("cardBackground");
  const borderColor = useThemeValue("borderColor");
  const accentColor = useThemeValue("accentPurple"); // Usando accentPurple para consistência
  const buttonText = useThemeValue("buttonText");

  // Tipos de referência disponíveis (incluindo "Todos")
  const referenceTypes: (ReferenceType | "Todos")[] = useMemo(() => {
    const types = Array.from(new Set(referencesData.map((ref) => ref.type)));
    return ["Todos", ...types];
  }, []);

  // Lógica de filtragem das referências
  const filteredReferences = useMemo(() => {
    return referencesData.filter((reference) => {
      // Filtro por tipo
      const typeMatch =
        selectedType === "Todos" || reference.type === selectedType;

      // Filtro por termo de pesquisa
      // Vamos criar uma string "pesquisável" para cada referência
      const searchableContent = [
        (reference as any).authors || (reference as any).organization || "",
        (reference as any).title || "",
        (reference as any).journal || "",
        (reference as any).description || "", // Caso algum tipo tenha descrição
        (reference as any).degree || "",
        (reference as any).university || "",
        (reference as any).city || "",
        (reference as any).publisher || "",
        (reference as any).doi || "",
        (reference as any).url || "",
      ]
        .join(" ")
        .toLowerCase();

      const searchMatch = searchableContent.includes(searchTerm.toLowerCase());

      return typeMatch && searchMatch;
    });
  }, [searchTerm, selectedType]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <BackButton />
        <ThemedText style={[styles.title, { color: textColor }]}>
          Referências
        </ThemedText>
      </View>

      {/* Barra de Pesquisa */}
      <ThemedView
        style={[
          styles.searchContainer,
          { backgroundColor: cardBg, borderColor },
        ]}>
        <Feather name="search" size={20} color={textSecondary} />
        <ThemedInput
          style={styles.searchInput}
          placeholder="Buscar referência..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </ThemedView>

      {/* Filtros de Tipo */}
      <View style={styles.filtersContainer}>
        <ThemedText
          style={[styles.filterSectionTitle, { color: textSecondary }]}>
          Filtrar por Tipo
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {referenceTypes.map((type) => {
            const isActive = selectedType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  { backgroundColor: cardBg, borderColor },
                  isActive && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                ]}
                onPress={() => setSelectedType(type)}>
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    { color: isActive ? buttonText : textColor },
                  ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                  {/* Capitaliza a primeira letra */}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredReferences}
        keyExtractor={(item, index) =>
          `${item.type}-${index}-${(item as any).title}`
        } // Chave mais robusta
        renderItem={({ item }) => <ReferenceCard reference={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: textColor }]}>
              Nenhuma referência encontrada.
            </ThemedText>
            <ThemedText style={[styles.emptySubText, { color: textSecondary }]}>
              Tente ajustar sua busca ou filtros.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    paddingTop: Padding.xxl,
    paddingBottom: Padding.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginLeft: Margin.sm,
  },
  // --- Estilos da Barra de Pesquisa ---
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Margin.md,
    paddingHorizontal: Padding.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Margin.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    marginLeft: Margin.sm,
    borderWidth: 0,
    paddingVertical: Padding.sm,
    textAlign: "left",
  },
  // --- Estilos dos Filtros (Reutilizados do QuizListScreen) ---
  filtersContainer: {
    paddingTop: Margin.md,
  },
  filterSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    marginHorizontal: Margin.md,
    marginBottom: Margin.sm,
  },
  filterScroll: {
    paddingHorizontal: Padding.md,
    paddingBottom: Margin.md,
  },
  filterButton: {
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.md,
    borderRadius: BorderRadius.full,
    marginRight: Margin.sm,
    borderWidth: 1,
  },
  filterButtonText: {
    fontWeight: FontWeight.semiBold,
  },
  // --- Estilos da Lista e Vazio ---
  listContent: {
    paddingHorizontal: Padding.md,
    paddingBottom: Padding.lg,
    paddingTop: Padding.sm,
    gap: Margin.md, // Adicionado gap para espaçamento entre os cards
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Margin.xl, // Ajustado para ser visível
    paddingHorizontal: Padding.xl,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: FontSize.sm,
    marginTop: Margin.sm,
    textAlign: "center",
  },
});
