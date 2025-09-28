import FilterTabs from "@/src/components/common/FilterTabs";
import GlassTop from "@/src/components/common/GlassTop";
import SearchComponent from "@/src/components/common/SearchComponent";
import { NoteMasonryCard } from "@/src/components/notes/NoteListItem";
import TemplateMenuModal from "@/src/components/notes/NoteMenuModal";
import { IconButton } from "@/src/components/ui/icon/IconButton";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import type { Note } from "@/src/storage/notesStorage";
import { useNotesActions, useNotesStore } from "@/src/store/notesStore";
import { MasonryFlashList } from "@shopify/flash-list";
import { useFocusEffect, useRouter } from "expo-router";
import { NotebookPen } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const EmptyNotes = () => {
  const iconColor = useThemeValue("textSecondary");
  const textSecondary = useThemeValue("textSecondary");
  return (
    <View style={styles.emptyContainer}>
      <NotebookPen size={64} color={iconColor} strokeWidth={1} />
      <ThemedText style={styles.emptyTitle}>Sua mente, organizada</ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: textSecondary }]}>
        Toque no botão de cima para criar sua primeira anotação e registrar suas
        ideias.
      </ThemedText>
    </View>
  );
};

const tryParse = (s: string) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

function extractSearchableText(content: string): string {
  const parsed = tryParse(content);
  if (!parsed) return content;
  if (Array.isArray(parsed)) {
    const textBlock = parsed.find(
      (b) => (b?.type ?? "").toLowerCase() === "text"
    );
    const t = (textBlock?.value ?? "").toString();
    const listBlock = parsed.find((b) =>
      ["checklist", "tasks", "todos", "todo"].includes(
        (b?.type ?? "").toLowerCase()
      )
    );
    const items = (listBlock?.value ?? []) as any[];
    const listText = Array.isArray(items)
      ? items.map((i) => i?.text ?? i?.title ?? i?.label ?? "").join(" ")
      : "";
    return [t, listText].filter(Boolean).join(" ");
  }
  if (Array.isArray((parsed as any)?.blocks)) {
    const blocks = (parsed as any).blocks;
    const t = (
      blocks.find((b: any) => (b?.type ?? "").toLowerCase() === "text")
        ?.value ?? ""
    ).toString();
    const lb = blocks.find((b: any) =>
      ["checklist", "tasks", "todos", "todo"].includes(
        (b?.type ?? "").toLowerCase()
      )
    );
    const items = (lb?.value ?? []) as any[];
    const listText = Array.isArray(items)
      ? items.map((i) => i?.text ?? i?.title ?? i?.label ?? "").join(" ")
      : "";
    return [t, listText].filter(Boolean).join(" ");
  }
  const guess =
    ((parsed as any).text ?? (parsed as any).content ?? "") +
    " " +
    (Array.isArray((parsed as any).tasks)
      ? (parsed as any).tasks
          .map((i: any) => i?.text ?? i?.title ?? "")
          .join(" ")
      : "");
  return guess.toString();
}

const normalize = (s: string) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export default function NotesDashboard() {
  const router = useRouter();
  const { notes, isLoading } = useNotesStore();
  const { init } = useNotesActions();
  const background = useThemeValue("background");
  const black = useThemeValue("text");
  const insets = useSafeAreaInsets();

  const [isTemplateMenuVisible, setTemplateMenuVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const TAB_TO_TYPE: Record<string, string | null> = {
    Todos: null,
    Rápidos: "quick",
    Tarefas: "task",
    Análises: "analysis",
  };

  useFocusEffect(
    useCallback(() => {
      init();
    }, [init])
  );

  const handleSelectTemplate = (template: string) => {
    setTemplateMenuVisible(false);
    setTimeout(() => {
      router.push(
        `/notes/new?template=${template === "analysis" ? "analysis" : template}`
      );
    }, 200);
  };

  const TABS = ["Todos", "Rápidos", "Tarefas", "Análises"] as const;

  const filteredNotes = useMemo(() => {
    const wanted = TAB_TO_TYPE[selectedTab];
    const needle = normalize(searchTerm);

    const arr = notes.filter((n) => {
      if (wanted && (n.type ?? "").toLowerCase() !== wanted) return false;
      if (!needle) return true;

      const hay1 = normalize(n.title || "");
      const hay2 = normalize(extractSearchableText(n.content || ""));
      return hay1.includes(needle) || hay2.includes(needle);
    });

    arr.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    return arr;
  }, [notes, selectedTab, searchTerm]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: background }}
      edges={["left", "right", "bottom"]}>
      <GlassTop safeTop={false}>
        <View style={styles.header}>
          <View style={{ width: "85%" }}>
            <ThemedText style={styles.title}>Anotações</ThemedText>
            <ThemedText>Organize suas ideias facilmente.</ThemedText>
          </View>
          <View style={{ width: "15%", height: 50 }}>
            <IconButton
              onPress={() => setTemplateMenuVisible(true)}
              iconName="pencil-plus"
              iconLibrary="MaterialCommunityIcons"
              accessibilityLabel="Criar uma nova nota"
              style={styles.createNote}
              iconSize={26}
              iconColor={black}
            />
          </View>
        </View>
      </GlassTop>

      <View style={{ marginTop: -20, paddingHorizontal: Padding.lg }}>
        <SearchComponent
          placeholder="Buscar por título ou conteúdo…"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <FilterTabs<string>
          data={TABS as unknown as string[]}
          selectedValue={selectedTab}
          onSelect={(tab) => {
            setSelectedTab(tab);

            setSearchTerm("");
          }}
          getValue={(t) => t}
          getLabel={(t) => t}
        />
      </View>
      <View style={{ flex: 1 }}>
        <MasonryFlashList
          keyboardShouldPersistTaps="handled"
          data={filteredNotes}
          numColumns={2}
          keyExtractor={(it) => String(it.id)}
          estimatedItemSize={240}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            paddingHorizontal: Padding.lg,
            paddingBottom: insets.bottom + 80,
          }}
          ListEmptyComponent={<EmptyNotes />}
          renderItem={({ item, index }) => (
            <View style={{ marginHorizontal: 6 }}>
              <NoteMasonryCard
                item={item as Note}
                index={index}
                onPress={() => router.push(`/notes/${item.id}`)}
              />
            </View>
          )}
        />
      </View>
      <TemplateMenuModal
        isVisible={isTemplateMenuVisible}
        onClose={() => setTemplateMenuVisible(false)}
        onSelect={handleSelectTemplate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Padding.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Margin.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 0.5,
  },
  createNote: {
    borderWidth: 0.3,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    marginRight: 30,
  },
  emptyContainer: {
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
