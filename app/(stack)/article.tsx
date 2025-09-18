import { ARTICLE_DATA } from "@/data/articleData";
import { ArticleListItem } from "@/src/components/articles/ArticleListItem";
import SearchComponent from "@/src/components/common/SearchComponent";
import ThemedFlatList from "@/src/components/common/ThemedFlatList";
import TitleSection from "@/src/components/common/TitleSection";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import React, { useMemo, useState } from "react";

export default function ArticleListScreen() {
  const [searchTerm, setSearchTerm] = useState("");

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
    <ScreenLayout>
      <TitleSection
        title="Artigos"
        subtitle="Explore nossos artigos sobre diversos temas"
      />
      <SearchComponent
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar artigos..."
      />
      <ThemedFlatList
        keyExtractor={(item) => `${item.title}-${item.journal}`}
        data={filteredArticles}
        renderItem={({ item }) => <ArticleListItem item={item} />}
        emptyMessage="Nenhum artigo encontrado"
        emptySubMessage="Tente usar outras palavras-chave."
      />
    </ScreenLayout>
  );
}
