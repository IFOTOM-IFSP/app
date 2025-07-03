import SearchComponent from "@/components/common/SearchComponent";
import ThemedFlatList from "@/components/common/ThemedFlatList";
import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { ArticleListItem } from "@/components/specific/articles/ArticleListItem";
import { ARTICLE_DATA } from "@/data/articleData";
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
