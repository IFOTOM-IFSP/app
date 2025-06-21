import { ArticleListItem } from "@/components/specific/articles/ArticleListItem";
import BackButton from "@/components/ui/BackButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { BorderRadius, FontSize, Margin, Padding } from "@/constants/Styles";
import { ARTICLE_DATA } from "@/data/articleData";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function ArticleListScreen() {
  const [searchTerm, setSearchTerm] = useState("");

  const bgColor = useThemeValue("background");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const cardBg = useThemeValue("cardBackground");
  const borderColor = useThemeValue("borderColor");

  const filteredArticles = useMemo(() => {
    if (!searchTerm) {
      return ARTICLE_DATA;
    }
    return ARTICLE_DATA.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <BackButton />
        <ThemedText style={[styles.title, { color: textColor }]}>
          Artigos Recomendados
        </ThemedText>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: cardBg, borderColor },
        ]}>
        <Feather name="search" size={20} color={textSecondary} />
        <ThemedInput
          style={styles.searchInput}
          placeholder="Buscar nos artigos..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleListItem item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: textColor }]}>
              Nenhum artigo encontrado
            </ThemedText>
            <ThemedText style={{ color: textSecondary }}>
              Tente usar outras palavras-chave.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    paddingTop: Padding.xl,
    paddingBottom: Padding.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    marginLeft: Margin.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Margin.md,
    marginVertical: Margin.md,
    paddingHorizontal: Padding.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    marginLeft: Margin.sm,
    borderWidth: 0,
    paddingVertical: Padding.sm,
  },
  list: {
    paddingHorizontal: Padding.md,
    paddingBottom: Padding.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    marginBottom: Margin.sm,
  },
});
