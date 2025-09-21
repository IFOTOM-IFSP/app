import { Margin, Padding, Spacing } from "@/src/constants/Styles";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { useNotesActions, useNotesStore } from "@/src/store/notesStore";

import ThemedFlatList from "@/src/components/common/ThemedFlatList";
import TitleSection from "@/src/components/common/TitleSection";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { CreateNoteFAB } from "@/src/components/notes/CreateNoteFAB";
import { NoteListItem } from "@/src/components/notes/NoteListItem"; // <- Importamos o novo item da lista
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Note } from "@/src/storage/notesStorage";
import { NotebookPen } from "lucide-react-native";

// Novo componente para quando a lista está vazia
const EmptyNotes = () => {
  const iconColor = useThemeValue("textSecondary");
  const textSecondary = useThemeValue("textSecondary");
  return (
    <View style={styles.emptyContainer}>
      <NotebookPen size={64} color={iconColor} strokeWidth={1} />
      <ThemedText style={styles.emptyTitle}>Sua mente, organizada</ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: textSecondary }]}>
        Toque no botão '+' para criar sua primeira anotação e registrar suas
        ideias.
      </ThemedText>
    </View>
  );
};

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading } = useNotesStore();
  const { init } = useNotesActions();

  useFocusEffect(
    useCallback(() => {
      init();
    }, [init])
  );

  return (
    <ScreenLayout>
      <TitleSection
        title="Minhas Anotações"
        subtitle="Veja seu histórico ou inicie uma nova anotação."
      />
      <ThemedFlatList<Note>
        data={notes}
        contentContainerStyle={{}}
        renderItem={({ item, index }) => (
          <NoteListItem
            item={item}
            index={index}
            onPress={() => router.push(`/notes/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={init}
        refreshing={isLoading}
        ListEmptyComponent={<EmptyNotes />}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        emptyMessage={""}
      />
      <View style={{ marginBottom: 80 }}>
        <CreateNoteFAB />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.xl,
    marginTop: "30%",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: Margin.md,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: Margin.sm,
    lineHeight: 24,
  },
});
