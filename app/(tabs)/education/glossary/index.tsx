import FilterTabs from "@/components/common/FilterTabs";
import SearchComponent from "@/components/common/SearchComponent";
import ThemedFlatList from "@/components/common/ThemedFlatList";
import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { GlossaryListItem } from "@/components/specific/glossary/GlossaryListItem";
import { Padding } from "@/constants/Styles";
import { glossaryData } from "@/data/glossaryData";
import React, { useMemo, useState } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  theme: string;
}
export default function GlossaryListScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("Todos");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const themes = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set(glossaryData.map((item) => item.theme))),
    ],
    []
  );

  const toggleItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedItems(newSet);
  };

  const filteredData = useMemo(() => {
    return glossaryData
      .filter((item) => {
        const themeMatch =
          selectedTheme === "Todos" || item.theme === selectedTheme;
        const searchMatch = item.term
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return themeMatch && searchMatch;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedTheme]);

  return (
    <ScreenLayout>
      <TitleSection title="Glossário" />
      <SearchComponent
        placeholder="Buscar termo..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FilterTabs<string>
        data={themes}
        selectedValue={selectedTheme}
        onSelect={setSelectedTheme}
        getValue={(theme) => theme}
        getLabel={(theme) => theme}
      />
      <ThemedFlatList<GlossaryItem>
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GlossaryListItem
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        )}
        emptyMessage="Nenhum termo encontrado."
        contentContainerStyle={{
          paddingHorizontal: Padding.md,
          paddingBottom: Padding.lg,
        }}
      />
    </ScreenLayout>
  );
}
