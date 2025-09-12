import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import {
  ChecklistItem,
  ChecklistItemRow,
} from "@/components/notes/ChecklistItemRow";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { FontSize, Padding, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Note } from "@/storage/notesStorage";
import { useNotesActions, useNotesStore } from "@/store/notesStore";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus, Save, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    template?: Note["type"];
    analysisId?: string;
    analysisName?: string;
  }>();
  const { currentNote } = useNotesStore();
  const isLoading = useNotesStore((state) => state.isLoading);
  const { fetchNote, saveNote, clearCurrentNote, deleteNote } =
    useNotesActions();

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const text = useThemeValue("text");
  const textSecondaryColor = useThemeValue("textSecondary");
  const primaryColor = useThemeValue("primary");
  const dangerColor = useThemeValue("danger");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [noteType, setNoteType] = useState<Note["type"]>("quick");
  const isNewNote = params.id === "new";

  useEffect(() => {
    if (isNewNote) {
      const typeFromParams = params.template || "quick";
      setNoteType(typeFromParams);
      setContent("");
      if (typeFromParams === "task") {
        setTitle("Nova Lista de Tarefas");
        setTasks([{ id: Date.now().toString(), text: "", isChecked: false }]);
      } else {
        setTitle(
          params.analysisName
            ? `Nota para: ${params.analysisName}`
            : "Nova Nota"
        );
        setTasks([]);
      }
    } else {
      fetchNote(Number(params.id));
    }
    return () => clearCurrentNote();
  }, [params.id]);

  useEffect(() => {
    if (currentNote && !isNewNote) {
      setNoteType(currentNote.type);
      setTitle(currentNote.title);
      if (currentNote.type === "task") {
        try {
          const parsedTasks = JSON.parse(currentNote.content || "[]");
          setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
        } catch {
          setTasks([]);
        }
      } else {
        setContent(currentNote.content);
      }
    }
  }, [currentNote]);

  const handleDelete = () => {
    Alert.alert(
      "Apagar Nota",
      "Tem a certeza que deseja apagar esta nota? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            if (isNewNote || !currentNote) return;
            try {
              await deleteNote(currentNote.id);
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível apagar a nota.");
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Atenção", "Por favor, adicione um título.");
      return;
    }
    const finalContent = noteType === "task" ? JSON.stringify(tasks) : content;
    try {
      await saveNote({
        id: isNewNote ? undefined : Number(params.id),
        title,
        content: finalContent,
        type: noteType,
        analysisId: params.analysisId
          ? Number(params.analysisId)
          : currentNote?.analysisId,
        analysisName: params.analysisName || currentNote?.analysisName,
      });
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Falha ao guardar a nota.");
    }
  };

  const handleToggleTask = (taskId: string) =>
    setTasks((current) =>
      current.map((t) =>
        t.id === taskId ? { ...t, isChecked: !t.isChecked } : t
      )
    );
  const handleTaskTextChange = (taskId: string, newText: string) =>
    setTasks((current) =>
      current.map((t) => (t.id === taskId ? { ...t, text: newText } : t))
    );
  const handleAddNewTask = () =>
    setTasks((current) => [
      ...current,
      { id: Date.now().toString(), text: "", isChecked: false },
    ]);
  const handleDeleteTask = (taskId: string) =>
    setTasks((current) => current.filter((t) => t.id !== taskId));

  const TitleHeader = () => (
    <View style={styles.titleContainer}>
      <TextInput
        style={[styles.titleInput, { color: text }]}
        placeholder={noteType === "task" ? "Título da Lista" : "Título da Nota"}
        placeholderTextColor={textSecondaryColor}
        value={title}
        onChangeText={setTitle}
      />
      {!isNewNote && (
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={24} color={dangerColor} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderChecklist = () => (
    <FlatList
      data={tasks}
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: insets.bottom + 120 },
      ]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChecklistItemRow
          item={item}
          onToggle={handleToggleTask}
          onChangeText={handleTaskTextChange}
          onDeleteItem={handleDeleteTask}
        />
      )}
      ListHeaderComponent={<TitleHeader />}
      ListFooterComponent={
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={handleAddNewTask}>
          <Plus size={18} color={textSecondaryColor} />
          <ThemedText style={{ color: textSecondaryColor }}>
            Adicionar Tarefa
          </ThemedText>
        </TouchableOpacity>
      }
    />
  );

  const renderStandardNote = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: insets.bottom + 120 },
      ]}>
      <TitleHeader />
      <TextInput
        style={[styles.contentInput, { color: text }]}
        placeholder="Comece a escrever aqui..."
        placeholderTextColor={textSecondaryColor}
        value={content}
        onChangeText={setContent}
        multiline
      />
    </ScrollView>
  );

  if (isLoading && !currentNote && !isNewNote) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={headerHeight}>
      <ScreenLayout>
        {noteType === "task" ? renderChecklist() : renderStandardNote()}
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: primaryColor,
              bottom: insets.bottom + Spacing.md,
            },
          ]}
          onPress={handleSave}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Save size={24} color="white" />
          )}
        </TouchableOpacity>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { flexGrow: 1, padding: Padding.lg },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  titleInput: {
    flex: 1,
    fontSize: FontSize.xxl,
    fontWeight: "bold",
  },
  deleteButton: {
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  contentInput: {
    fontSize: FontSize.lg,
    lineHeight: 28,
    textAlignVertical: "top",
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Padding.sm,
    marginTop: Spacing.md,
    alignSelf: "flex-start",
  },
  saveButton: {
    position: "absolute",
    right: Spacing.lg,
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
