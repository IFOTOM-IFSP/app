import FilterTabs from "@/components/common/FilterTabs";
import SearchComponent from "@/components/common/SearchComponent";
import ThemedFlatList from "@/components/common/ThemedFlatList";
import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import ReferenceCard from "@/components/specific/references/ReferenceCard";
import { referencesData } from "@/data/referencesData";
import { Reference, ReferenceType } from "@/schema/referenceSchema";
import React, { useMemo, useState } from "react";

export default function ReferencesScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ReferenceType | "Todos">(
    "Todos"
  );

  const handleTypeSelect = (typeValue: string) => {
    setSelectedType(typeValue as ReferenceType | "Todos");
  };

  const referenceTypes: (ReferenceType | "Todos")[] = useMemo(() => {
    const types = Array.from(new Set(referencesData.map((ref) => ref.type)));
    return ["Todos", ...types];
  }, []);

  const filteredReferences = useMemo(() => {
    return referencesData.filter((reference) => {
      const typeMatch =
        selectedType === "Todos" || reference.type === selectedType;

      if (!typeMatch) return false;

      const searchableContent = [reference.title, ...Object.values(reference)]
        .join(" ")
        .toLowerCase();

      const searchMatch = searchableContent.includes(searchTerm.toLowerCase());

      return searchMatch;
    });
  }, [searchTerm, selectedType]);

  return (
    <ScreenLayout>
      <TitleSection
        title="Referências"
        subtitle="Encontre referências úteis para seus estudos"
      />

      <SearchComponent
        placeholder="Buscar referências..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FilterTabs<ReferenceType | "Todos">
        title="Filtrar por Tipo"
        data={referenceTypes}
        selectedValue={selectedType}
        onSelect={handleTypeSelect}
        getValue={(type) => type}
        getLabel={(type) => type.charAt(0).toUpperCase() + type.slice(1)}
      />

      <ThemedFlatList<Reference>
        data={filteredReferences}
        renderItem={({ item }) => <ReferenceCard reference={item} />}
        emptyMessage="Nenhuma referência encontrada."
        emptySubMessage="Tente ajustar sua busca ou filtros."
        keyExtractor={(item, index) => `${item.type}-${index}-${item.title}`}
      />
    </ScreenLayout>
  );
}
