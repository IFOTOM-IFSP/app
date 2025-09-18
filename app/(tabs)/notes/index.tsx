import { Margin, Padding, Spacing } from "@/constants/Styles";
import ThemedFlatList from "@/src/components/common/ThemedFlatList";
import { useNotesActions, useNotesStore } from "@/store/notesStore";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { useThemeValue } from "@/hooks/useThemeValue";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { CreateNoteFAB } from "@/src/components/notes/CreateNoteFAB";
import { NoteListItem } from "@/src/components/notes/NoteListItem";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { Note } from "@/src/native/storage/notesStorage";

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading } = useNotesStore();
  const { init } = useNotesActions();
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Minhas anotações
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Veja seu histórico ou inicie uma nova anotação.
        </ThemedText>
      </View>
      <ThemedFlatList<Note>
        data={notes}
        renderItem={({ item }) => (
          <NoteListItem
            item={item}
            onPress={() => router.push(`/notes/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={init}
        refreshing={isLoading}
        emptyMessage="Nenhuma nota ainda"
        emptySubMessage='Toque em "+" para criar a sua primeira nota.'
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
      <CreateNoteFAB />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: Padding.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: Margin.xs,
  },
});
