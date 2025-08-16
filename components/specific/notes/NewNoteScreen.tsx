import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { BorderRadius, FontSize, Padding, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { useNotesActions, useNotesStore } from "@/state/notesStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
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
import { ChecklistItem, ChecklistItemRow } from "./ChecklistItemRow";
export default function NewNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    template: "quick" | "analysis" | "task";
    analysisId?: string;
    analysisName?: string;
  }>();
  const { saveNote } = useNotesActions();

  const isLoading = useNotesStore((state) => state.isLoading);
  const insets = useSafeAreaInsets();

  const text = useThemeValue("text");
  const textSecondaryColor = useThemeValue("textSecondary");
  const cardColor = useThemeValue("card");
  const borderColor = useThemeValue("border");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const noteType = params.template || "quick";

    if (noteType === "task") {
      setTitle("Nova Lista de Tarefas");
      setItems([{ id: Date.now().toString(), text: "", isChecked: false }]);
    } else {
      setTitle(
        params.analysisName ? `Nota para: ${params.analysisName}` : "Nova Nota"
      );
    }
  }, []);
  const handleAddItem = () =>
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), text: "", isChecked: false },
    ]);
  const handleDeleteItem = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));
  const handleUpdateItemText = (id: string, text: string) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item))
    );
  const handleToggleCheck = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Atenção", "Por favor, adicione um título.");
      return;
    }

    const noteContent =
      params.template === "task" ? JSON.stringify(items) : content;

    try {
      await saveNote({
        title,
        content: noteContent,
        type: params.template ?? "quick",
        analysisId: params.analysisId ? Number(params.analysisId) : undefined,
        analysisName: params.analysisName,
      });
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível guardar a nota.");
    }
  };

  const renderChecklist = () => (
    <View style={[styles.inputContainer, { backgroundColor: cardColor }]}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ChecklistItemRow
            item={item}
            onToggle={handleToggleCheck}
            onChangeText={handleUpdateItemText}
            onDeleteItem={handleDeleteItem}
          />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: borderColor }]} />
        )}
      />
      <TouchableOpacity style={styles.addTaskButton} onPress={handleAddItem}>
        <Plus size={18} color={textSecondaryColor} />
        <ThemedText style={{ color: textSecondaryColor }}>
          Adicionar Tarefa
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderStandardNote = () => (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: cardColor, minHeight: 300 },
      ]}>
      <TextInput
        style={[styles.contentInput, { color: text }]}
        placeholder="Comece a escrever a sua nota aqui..."
        placeholderTextColor={textSecondaryColor}
        value={content}
        onChangeText={setContent}
        multiline
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.kav}
      keyboardVerticalOffset={110}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={[styles.titleInput, { color: text }]}
            placeholder="Título da Nota"
            placeholderTextColor={textSecondaryColor}
            value={title}
            onChangeText={setTitle}
          />
          {params.template === "task"
            ? renderChecklist()
            : renderStandardNote()}
        </ScrollView>
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom || Padding.md,
              borderTopColor: borderColor,
            },
          ]}>
          <Button
            title="Guardar Nota"
            onPress={handleSave}
            loading={isLoading}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: { padding: Padding.lg, flexGrow: 1 },
  titleInput: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    borderRadius: BorderRadius.lg,
    padding: Padding.md,
  },
  contentInput: {
    fontSize: FontSize.lg,
    lineHeight: 26,
    flex: 1,
    textAlignVertical: "top",
  },
  separator: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Padding.sm,
    marginTop: Spacing.md,
    alignSelf: "flex-start",
  },
  footer: {
    paddingHorizontal: Padding.lg,
    paddingTop: Padding.md,
    borderTopWidth: 1,
  },
});
