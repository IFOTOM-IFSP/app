// (app)/notes/index.tsx
import ThemedFlatList from "@/components/common/ThemedFlatList"; // Seu componente!
import { Spacing } from "@/constants/Styles";
import { useNotesActions, useNotesStore } from "@/state/notesStore";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";

import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { CreateNoteFAB } from "@/components/specific/notes/CreateNoteFAB";
import { NoteListItem } from "@/components/specific/notes/NoteListItem";
import { Note } from "@/storage/notesStorage";

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading } = useNotesStore();
  const { fetchAllNotes } = useNotesActions();

  useFocusEffect(
    useCallback(() => {
      fetchAllNotes();
    }, [])
  );

  return (
    <ScreenLayout>
      <TitleSection title="Notas" subtitle="Suas anotações e ideias" />
      <ThemedFlatList<Note>
        data={notes}
        renderItem={({ item }) => (
          <NoteListItem
            item={item}
            onPress={() => router.push(`/notes/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={fetchAllNotes}
        refreshing={isLoading}
        emptyMessage="Nenhuma nota ainda"
        emptySubMessage='Toque em "+" para criar a sua primeira nota.'
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
      <CreateNoteFAB />
    </ScreenLayout>
  );
}
