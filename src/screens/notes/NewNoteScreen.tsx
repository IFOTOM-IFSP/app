// NewNoteScreen.tsx
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import {
  useCurrentNote,
  useNotesActions,
  useNotesStore,
} from "@/src/store/notesStore";
import {
  ChecklistItem,
  ChecklistItemRow,
} from "../../components/notes/ChecklistItemRow";

import {
  BorderRadius,
  FontSize,
  Padding,
  Spacing,
} from "@/src/constants/Styles";

/* ===================== Tipos ===================== */
type Template = "quick" | "analysis" | "task";

type Attachment = {
  id: string;
  kind: "image" | "csv" | "pdf";
  uri: string;
  name: string;
};

type CalPoint = { c: number; A: number };

/* ========== Helpers de persistência de arquivo ========== */
const sanitize = (name: string) =>
  name.replace(/[^\p{L}\p{N}\.\-\\s]/gu, "_").slice(0, 80) || "arquivo";

async function persistFile(
  kind: "image" | "csv" | "pdf",
  srcUri: string,
  originalName?: string
) {
  const baseDir = FileSystem.documentDirectory + "attachments/";
  try {
    await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
  } catch {}
  const ext = (originalName?.split(".").pop() || srcUri.split(".").pop() || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const bare = sanitize((originalName || "arquivo").replace(/\.[^.]+$/, ""));
  const filename = `${Date.now()}-${bare}${ext ? "." + ext : ""}`;
  const destUri = baseDir + filename;
  await FileSystem.copyAsync({ from: srcUri, to: destUri });
  return { uri: destUri, name: originalName || filename };
}

/* ========== Editor: parser inline que combina (** _ ==) ========== */
type Seg = { text: string; bold: boolean; italic: boolean; mark: boolean };

function parseInline(text: string): Seg[] {
  const out: Seg[] = [];
  let buf = "";
  let bold = false,
    italic = false,
    mark = false;

  const flush = () => {
    if (buf.length) {
      out.push({ text: buf, bold, italic, mark });
      buf = "";
    }
  };

  let i = 0;
  while (i < text.length) {
    if (text[i] === "\n") {
      flush();
      out.push({ text: "\n", bold, italic, mark });
      i++;
      continue;
    }
    const two = text.slice(i, i + 2);
    if (two === "**") {
      flush();
      bold = !bold;
      i += 2;
      continue;
    }
    if (two === "==") {
      flush();
      mark = !mark;
      i += 2;
      continue;
    }
    if (text[i] === "_") {
      flush();
      italic = !italic;
      i++;
      continue;
    }
    buf += text[i++];
  }
  flush();
  return out;
}

const LiveFormatted = ({
  text,
  color,
  fontSize,
  lineHeight,
}: {
  text: string;
  color: string;
  fontSize: number;
  lineHeight: number;
}) => {
  const segs = parseInline(text);
  return (
    <Text style={{ fontSize, lineHeight, color }}>
      {segs.map((s, idx) => {
        if (s.text === "\n") return "\n";
        const style: any = {};
        if (s.bold) style.fontWeight = "700";
        if (s.italic) style.fontStyle = "italic";
        if (s.mark) {
          // sem padding para o cursor ficar colado ao texto
          style.backgroundColor = "rgba(255, 235, 59, 0.35)";
          style.borderRadius = 4;
        }
        return (
          <Text key={idx} style={style}>
            {s.text}
          </Text>
        );
      })}
    </Text>
  );
};

/* ===================== Tela ===================== */
export default function NewNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string; // edição quando presente
    template?: Template;
    analysisId?: string;
    analysisName?: string;
  }>();

  const { saveNote, deleteNote, fetchNote } = useNotesActions() as any;
  const isLoadingStore = useNotesStore((s) => s.isLoading);
  const loadedNote = useCurrentNote();

  const insets = useSafeAreaInsets();
  const text = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const border = useThemeValue("border");
  const primary = useThemeValue("primary");

  const isEditing = !!params.id && !isNaN(Number(params.id));

  // Estado base
  const [bootstrapping, setBootstrapping] = useState<boolean>(!!isEditing);

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<Template>("quick");

  // QUICK
  const [content, setContent] = useState("");
  const inputRef = useRef<TextInput>(null);

  // TASK
  const [items, setItems] = useState<ChecklistItem[]>([]);

  // ANALYSIS
  const [lambda, setLambda] = useState<string>("");
  const [calPoints, setCalPoints] = useState<CalPoint[]>([]);
  const [sampleA, setSampleA] = useState<string>("");
  const [reg, setReg] = useState<{
    slope: number;
    intercept: number;
    r2: number;
  }>({
    slope: 0,
    intercept: 0,
    r2: 0,
  });

  // META
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // UI topo
  const [menuVisible, setMenuVisible] = useState(false);
  const [showTagsEditor, setShowTagsEditor] = useState(false);
  const [saving, setSaving] = useState(false);

  // Tipografia do editor
  const [editorFontSize, setEditorFontSize] = useState(FontSize.lg);
  const editorLineHeight = Math.round(editorFontSize * 1.5);
  const incFont = () => setEditorFontSize((s) => Math.min(s + 2, 28));
  const decFont = () => setEditorFontSize((s) => Math.max(s - 2, 12));

  /* ---------- Hidratação quando for edição ---------- */
  useEffect(() => {
    async function hydrate(noteId: number) {
      setBootstrapping(true);
      await fetchNote(noteId);
      // finalizar quando loadedNote chegar
    }

    if (isEditing) {
      hydrate(Number(params.id));
    } else {
      const t = (params.template as Template) || "quick";
      setTemplate(t);
      if (t === "task") {
        setTitle("Nova Lista de Tarefas");
        setItems([{ id: String(Date.now()), text: "", isChecked: false }]);
      } else if (t === "analysis") {
        setTitle(
          params.analysisName
            ? `Análise: ${params.analysisName}`
            : "Nova Análise"
        );
        setCalPoints([{ c: 0, A: 0 }]);
      } else {
        setTitle(
          params.analysisName ? `Nota: ${params.analysisName}` : "Nova Nota"
        );
      }
      setBootstrapping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, params.id]);

  useEffect(() => {
    if (!isEditing) return;
    if (!loadedNote) return;

    try {
      setTitle(loadedNote.title || "");
      setTemplate(loadedNote.type as Template);
      setTags(Array.isArray(loadedNote.tags) ? loadedNote.tags : []);

      let parsed: any = null;
      try {
        parsed = JSON.parse(loadedNote.content);
      } catch {
        parsed = loadedNote.content; // legado
      }

      if (loadedNote.type === "quick") {
        if (parsed && typeof parsed === "object" && "text" in parsed) {
          setContent(String(parsed.text || ""));
          if (Array.isArray(parsed.attachments)) {
            setAttachments(
              parsed.attachments.map((a: any) => ({
                id: String(Date.now()) + Math.random(),
                kind: a.kind,
                uri: a.uri,
                name: a.name,
              }))
            );
          }
        } else {
          setContent(typeof parsed === "string" ? parsed : "");
        }
      } else if (loadedNote.type === "task") {
        if (
          parsed &&
          typeof parsed === "object" &&
          Array.isArray(parsed.items)
        ) {
          setItems(
            parsed.items.map((it: any) => ({
              id: it.id || String(Date.now()) + Math.random(),
              text: String(it.text || ""),
              isChecked: !!it.isChecked,
            }))
          );
          if (Array.isArray(parsed.attachments)) {
            setAttachments(
              parsed.attachments.map((a: any) => ({
                id: String(Date.now()) + Math.random(),
                kind: a.kind,
                uri: a.uri,
                name: a.name,
              }))
            );
          }
        } else {
          setItems([]);
        }
      } else if (loadedNote.type === "analysis") {
        if (Array.isArray(parsed)) {
          const textBlock = parsed.find((b: any) => b?.type === "text");
          setContent(textBlock?.value ? String(textBlock.value) : "");

          const meta = parsed.find((b: any) => b?.type === "meta");
          setLambda(
            meta?.value?.lambda != null ? String(meta.value.lambda) : ""
          );

          const cal = parsed.find((b: any) => b?.type === "calibration");
          setCalPoints(
            Array.isArray(cal?.value)
              ? cal.value.map((p: any) => ({
                  c: Number(p.c) || 0,
                  A: Number(p.A) || 0,
                }))
              : []
          );

          const sa = parsed.find((b: any) => b?.type === "sampleAbsorbance");
          setSampleA(sa?.value != null ? String(sa.value) : "");

          const att = parsed.find((b: any) => b?.type === "attachments");
          if (Array.isArray(att?.value)) {
            setAttachments(
              att.value.map((a: any) => ({
                id: String(Date.now()) + Math.random(),
                kind: a.kind,
                uri: a.uri,
                name: a.name,
              }))
            );
          }
        } else {
          setContent("");
          setCalPoints([{ c: 0, A: 0 }]);
          setLambda("");
          setSampleA("");
        }
      }
    } finally {
      setBootstrapping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedNote, isEditing]);

  /* ---------- Checklist (TASK) ---------- */
  const addTask = () =>
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), text: "", isChecked: false },
    ]);
  const deleteTask = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const toggleTask = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isChecked: !i.isChecked } : i))
    );
  const updateTaskText = (id: string, t: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, text: t } : i)));

  /* ---------- Toolbar (embaixo, só formatação) ---------- */
  const surroundSelection = (token: string) => {
    setContent(
      (c) => `${c}${c && !c.endsWith("\n") ? "\n" : ""}${token}Texto${token}`
    );
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  /* ---------- Calibração (ANALYSIS) ---------- */
  const addCalRow = () => setCalPoints((p) => [...p, { c: 0, A: 0 }]);
  const updateCalRow = (idx: number, key: keyof CalPoint, value: string) =>
    setCalPoints((p) =>
      p.map((row, i) =>
        i === idx
          ? { ...row, [key]: Number(value.replace(",", ".")) || 0 }
          : row
      )
    );
  const removeCalRow = (idx: number) =>
    setCalPoints((p) => p.filter((_, i) => i !== idx));

  const recomputeReg = () => {
    const pts = calPoints.filter(
      (p) => Number.isFinite(p.c) && Number.isFinite(p.A)
    );
    if (pts.length < 2) {
      setReg({ slope: 0, intercept: 0, r2: 0 });
      return;
    }
    let n = pts.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0,
      sumYY = 0;
    for (const { c, A } of pts) {
      sumX += c;
      sumY += A;
      sumXY += c * A;
      sumXX += c * c;
      sumYY += A * A;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const ssTot = sumYY - (sumY * sumY) / n;
    const ssRes = pts.reduce(
      (acc, p) => acc + Math.pow(p.A - (slope * p.c + intercept), 2),
      0
    );
    const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
    setReg({ slope, intercept, r2 });
  };

  useEffect(() => {
    if (template === "analysis") recomputeReg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(calPoints)]);

  const estimatedC = useMemo(() => {
    const A = Number(String(sampleA).replace(",", "."));
    return reg.slope ? (A - reg.intercept) / reg.slope : 0;
  }, [sampleA, reg]);

  /* ---------- CSV/PDF (import/export) ---------- */
  const exportCalibrationCSV = async () => {
    const header = "c,A\n";
    const rows = calPoints.map((p) => `${p.c},${p.A}`).join("\n");
    const csv = header + rows + "\n";
    const fileUri = `${
      FileSystem.cacheDirectory || FileSystem.documentDirectory
    }calibracao.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, { mimeType: "text/csv" });
    } else {
      Alert.alert("Exportado", fileUri);
    }
  };

  const pickPdfOnly = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf"],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const f = res.assets[0];
    const p = await persistFile("pdf", f.uri, f.name);
    addAttachment({ kind: "pdf", uri: p.uri, name: p.name });
  };

  const importCSV = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: [
        "text/csv",
        "application/vnd.ms-excel",
        "text/plain",
        "application/pdf",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const f = res.assets[0];

    if (f.mimeType?.includes("pdf") || f.name.toLowerCase().endsWith(".pdf")) {
      const p = await persistFile("pdf", f.uri, f.name);
      addAttachment({ kind: "pdf", uri: p.uri, name: p.name });
      return;
    }

    const txt = await FileSystem.readAsStringAsync(f.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const lines = txt.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) return;
    const first = lines[0].toLowerCase().replace(/\s/g, "");
    const dataRows =
      first.includes(",") && !first.match(/^[\d.]+,[\d.]+$/)
        ? lines.slice(1)
        : lines;
    const parsed = dataRows
      .map((ln) => ln.split(/[;,]/).map((x) => Number(x.replace(",", "."))))
      .filter(
        (arr) =>
          arr.length >= 2 && Number.isFinite(arr[0]) && Number.isFinite(arr[1])
      );

    if (!parsed.length) {
      Alert.alert("CSV inválido", "Não foi possível ler dados numéricos.");
      return;
    }

    if (first.includes("nm")) {
      const p = await persistFile("csv", f.uri, f.name);
      addAttachment({ kind: "csv", uri: p.uri, name: p.name });
      Alert.alert("Anexo adicionado", "Espectro (nm,A) anexado à nota.");
    } else {
      setCalPoints(parsed.map(([c, A]) => ({ c, A })));
      Alert.alert("Importado", "Calibração (c,A) atualizada a partir do CSV.");
    }
  };

  /* ---------- Anexos e Tags ---------- */
  const addAttachment = (a: Omit<Attachment, "id">) =>
    setAttachments((prev) => [
      ...prev,
      { id: String(Date.now()) + Math.random(), ...a },
    ]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão", "Conceda acesso às fotos para anexar imagens.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]) {
      const p = await persistFile(
        "image",
        res.assets[0].uri,
        res.assets[0].fileName || "foto.jpg"
      );
      addAttachment({
        kind: "image",
        uri: p.uri,
        name: p.name,
      });
    }
  };

  const pickDoc = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const f = res.assets[0];
    const isCsv =
      f.mimeType?.includes("csv") || f.name.toLowerCase().endsWith(".csv");
    const p = await persistFile(isCsv ? "csv" : "pdf", f.uri, f.name);
    addAttachment({ kind: isCsv ? "csv" : "pdf", uri: p.uri, name: p.name });
  };

  const removeAttachment = (id: string) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    setTags((t) => (t.includes(v) ? t : [...t, v]));
    setTagInput("");
  };
  const removeTag = (t: string) =>
    setTags((prev) => prev.filter((x) => x !== t));

  /* ---------- Menu superior (⋯) ---------- */
  const openOverflow = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancelar",
            "Adicionar tag",
            "Anexar imagem",
            "Anexar documento (CSV/PDF)",
            "Inserir PDF",
          ],
          cancelButtonIndex: 0,
          userInterfaceStyle: "dark",
        },
        (i) => {
          if (i === 1) setShowTagsEditor(true);
          if (i === 2) pickImage();
          if (i === 3) pickDoc();
          if (i === 4) pickPdfOnly();
        }
      );
    } else {
      setMenuVisible((v) => !v);
    }
  };

  /* ---------- Save/Delete ---------- */
  const handleSave = async () => {
    if (saving) return;
    if (!title.trim()) {
      Alert.alert("Atenção", "Adicione um título.");
      return;
    }
    setSaving(true);
    let noteContent: string;

    if (template === "task") {
      const cleaned = items.filter((i) => i.text.trim().length > 0);
      noteContent = JSON.stringify({ items: cleaned, tags, attachments });
    } else if (template === "analysis") {
      const blocks = [
        { type: "text", value: content || "" },
        { type: "meta", value: { lambda: Number(lambda) || null } },
        { type: "calibration", value: calPoints },
        {
          type: "sampleAbsorbance",
          value: Number(String(sampleA).replace(",", ".")) || null,
        },
        { type: "tags", value: tags },
        { type: "attachments", value: attachments },
      ];
      noteContent = JSON.stringify(blocks);
    } else {
      noteContent = JSON.stringify({ text: content, tags, attachments });
    }

    try {
      const payload: any = {
        id: isEditing ? Number(params.id) : undefined,
        title: title.trim(),
        content: noteContent,
        type: template,
        analysisId: params.analysisId ? Number(params.analysisId) : undefined,
        analysisName: params.analysisName,
        tags, // persistência relacional
      };
      await (saveNote as any)(payload);
      router.back();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível guardar a nota.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const noteId = isEditing ? Number(params.id) : undefined;
    if (!noteId) {
      Alert.alert("Nada para apagar", "Esta nota ainda não foi salva.");
      return;
    }
    Alert.alert(
      "Apagar nota",
      "Tem certeza? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await (deleteNote as any)?.(noteId);
              router.back();
            } catch {
              Alert.alert("Erro", "Não foi possível apagar.");
            }
          },
        },
      ]
    );
  };

  /* ===================== UI ===================== */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 60}>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: insets.top + Padding.md,
            paddingHorizontal: Padding.lg,
            paddingBottom: insets.bottom + 24,
          }}>
          {/* Header: título + salvar + apagar + menu */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: Spacing.md,
              gap: 8,
            }}>
            <TextInput
              style={[styles.titleInput, { color: text }]}
              placeholder={isEditing ? "Editar título" : "Título da nota"}
              placeholderTextColor={textSecondary}
              value={title}
              onChangeText={setTitle}
              editable={!bootstrapping}
            />

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving || isLoadingStore || bootstrapping}
                style={[
                  styles.saveBtn,
                  {
                    opacity:
                      saving || isLoadingStore || bootstrapping ? 0.6 : 1,
                    backgroundColor: primary,
                  },
                ]}>
                <ThemedText
                  style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                  {saving || isLoadingStore
                    ? "Guardando..."
                    : isEditing
                    ? "Atualizar"
                    : "Guardar"}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                <ThemedText
                  style={{ fontSize: 14, color: "#D11A2A", fontWeight: "700" }}>
                  Apagar
                </ThemedText>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  onPress={openOverflow}
                  style={styles.overflowBtn}>
                  <ThemedText style={{ fontSize: 18 }}>⋯</ThemedText>
                </TouchableOpacity>

                {/* Android dropdown */}
                {Platform.OS !== "ios" && menuVisible && (
                  <>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setMenuVisible(false)}
                      style={styles.menuBackdrop}
                    />
                    <View style={[styles.menuCard, { borderColor: border }]}>
                      <ThemedText style={styles.menuHeader}>
                        Anexos e Tags
                      </ThemedText>
                      <View style={styles.menuDivider} />
                      <TouchableOpacity
                        onPress={() => {
                          setShowTagsEditor(true);
                          setMenuVisible(false);
                        }}
                        style={styles.menuRow}>
                        <ThemedText style={styles.menuEmoji}>🏷️</ThemedText>
                        <ThemedText style={styles.menuItemText}>
                          Adicionar tag
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          pickImage();
                          setMenuVisible(false);
                        }}
                        style={styles.menuRow}>
                        <ThemedText style={styles.menuEmoji}>🖼️</ThemedText>
                        <ThemedText style={styles.menuItemText}>
                          Anexar imagem
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          pickDoc();
                          setMenuVisible(false);
                        }}
                        style={styles.menuRow}>
                        <ThemedText style={styles.menuEmoji}>📎</ThemedText>
                        <ThemedText style={styles.menuItemText}>
                          Anexar documento (CSV/PDF)
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          pickPdfOnly();
                          setMenuVisible(false);
                        }}
                        style={styles.menuRow}>
                        <ThemedText style={styles.menuEmoji}>📄</ThemedText>
                        <ThemedText style={styles.menuItemText}>
                          Inserir PDF
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* CONTEÚDO */}
          {template === "task" ? (
            <View style={[styles.card, { borderColor: border }]}>
              <View>
                {items.map((it, idx) => (
                  <View key={it.id}>
                    <ChecklistItemRow
                      item={it}
                      onToggle={toggleTask}
                      onChangeText={updateTaskText}
                      onDeleteItem={deleteTask}
                    />
                    {idx < items.length - 1 && (
                      <View
                        style={[styles.separator, { backgroundColor: border }]}
                      />
                    )}
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={addTask}
                disabled={bootstrapping}>
                <ThemedText style={{ color: textSecondary }}>
                  + Adicionar tarefa
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editorContainer}>
              {/* Render formatado (fundo) */}
              <View style={{ position: "relative" }}>
                <View pointerEvents="none">
                  {content ? (
                    <LiveFormatted
                      text={content}
                      color={text}
                      fontSize={editorFontSize}
                      lineHeight={editorLineHeight}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: editorFontSize,
                        lineHeight: editorLineHeight,
                        opacity: 0.7,
                        color: textSecondary,
                      }}>
                      Escreva aqui… (use **negrito**, _itálico_, ==destaque==)
                    </Text>
                  )}
                </View>

                {/* TextInput transparente por cima */}
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.contentInputOverlay,
                    {
                      fontSize: editorFontSize,
                      lineHeight: editorLineHeight,
                      color: "rgba(0,0,0,0.01)", // quase invisível (Android lida melhor que 'transparent')
                      letterSpacing: 0,
                    },
                  ]}
                  multiline
                  textAlignVertical="top"
                  value={content}
                  onChangeText={setContent}
                  selectionColor={"rgba(212, 126, 223, 0.42)"}
                  placeholder=""
                  editable={!bootstrapping}
                />
              </View>

              {/* Tags */}
              {(showTagsEditor || tags.length > 0) && (
                <View style={{ marginTop: 14 }}>
                  {showTagsEditor && (
                    <View style={[styles.row, { gap: 8, marginBottom: 10 }]}>
                      <TextInput
                        style={[styles.inlineInput, { color: text, flex: 1 }]}
                        placeholder="Ex.: λmax, ε, diluição"
                        placeholderTextColor={textSecondary}
                        value={tagInput}
                        onChangeText={setTagInput}
                        onSubmitEditing={addTag}
                        editable={!bootstrapping}
                      />
                      <TouchableOpacity
                        onPress={addTag}
                        style={styles.smallBtn}
                        disabled={bootstrapping}>
                        <ThemedText style={styles.smallBtnText}>
                          Adicionar
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setShowTagsEditor(false)}
                        style={styles.smallBtn}
                        disabled={bootstrapping}>
                        <ThemedText style={styles.smallBtnText}>
                          Fechar
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                  {!!tags.length && (
                    <View style={styles.tagsWrap}>
                      {tags.map((t) => (
                        <TouchableOpacity
                          key={t}
                          style={styles.tagPill}
                          onPress={() => removeTag(t)}>
                          <ThemedText style={{ fontSize: 12 }}>
                            {t} ×
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Toolbar inferior: tamanho + formatação */}
              <View style={styles.bottomToolbar}>
                <ToolbarButton label="A−" onPress={decFont} />
                <ToolbarButton label="A+" onPress={incFont} />
                <View style={{ width: 8 }} />
                <ToolbarButton
                  label="B"
                  onPress={() => surroundSelection("**")}
                />
                <ToolbarButton
                  label="i"
                  onPress={() => surroundSelection("_")}
                />
                <ToolbarButton
                  label="⇔"
                  onPress={() => surroundSelection("==")}
                />
              </View>

              {/* Anexos renderizados (se existirem) */}
              {!!attachments.length && (
                <View style={{ marginTop: 12, gap: 10 }}>
                  <AttachmentGallery
                    attachments={attachments}
                    border={border}
                    onRemove={removeAttachment}
                  />
                </View>
              )}
            </View>
          )}

          {/* ANALYSIS – bloco extra */}
          {template === "analysis" && (
            <View style={[styles.card, { borderColor: border }]}>
              <ThemedText style={styles.sectionTitle}>
                Calibração (c × A)
              </ThemedText>

              <View style={styles.row}>
                <View style={[styles.chip, { borderColor: border }]}>
                  <ThemedText style={styles.chipLabel}>λmax (nm)</ThemedText>
                  <TextInput
                    style={[styles.chipInput, { color: text }]}
                    keyboardType="numeric"
                    value={lambda}
                    onChangeText={setLambda}
                    placeholder="ex.: 665"
                    placeholderTextColor={textSecondary}
                    editable={!bootstrapping}
                  />
                </View>
              </View>

              <View style={styles.tableHead}>
                <ThemedText style={[styles.th, { color: textSecondary }]}>
                  c
                </ThemedText>
                <ThemedText style={[styles.th, { color: textSecondary }]}>
                  A
                </ThemedText>
                <View style={{ width: 56 }} />
              </View>

              {calPoints.map((p, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <TextInput
                    style={[styles.tdInput, { color: text }]}
                    keyboardType="decimal-pad"
                    value={String(p.c)}
                    onChangeText={(v) => updateCalRow(idx, "c", v)}
                    editable={!bootstrapping}
                  />
                  <TextInput
                    style={[styles.tdInput, { color: text }]}
                    keyboardType="decimal-pad"
                    value={String(p.A)}
                    onChangeText={(v) => updateCalRow(idx, "A", v)}
                    editable={!bootstrapping}
                  />
                  <TouchableOpacity
                    onPress={() => removeCalRow(idx)}
                    disabled={bootstrapping}>
                    <ThemedText style={{ color: textSecondary }}>
                      remover
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ))}

              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}>
                <TouchableOpacity
                  onPress={addCalRow}
                  style={styles.smallBtn}
                  disabled={bootstrapping}>
                  <ThemedText style={styles.smallBtnText}>+ Linha</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={importCSV}
                  style={styles.smallBtn}
                  disabled={bootstrapping}>
                  <ThemedText style={styles.smallBtnText}>
                    Importar CSV
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={exportCalibrationCSV}
                  style={styles.smallBtn}
                  disabled={bootstrapping}>
                  <ThemedText style={styles.smallBtnText}>
                    Exportar CSV
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 14 }}>
                <ThemedText>Slope: {reg.slope.toFixed(4)}</ThemedText>
                <ThemedText>Intercept: {reg.intercept.toFixed(4)}</ThemedText>
                <ThemedText>R²: {reg.r2.toFixed(4)}</ThemedText>
              </View>

              <View style={[styles.row, { marginTop: 12 }]}>
                <ThemedText style={{ marginRight: 8 }}>Amostra (A):</ThemedText>
                <TextInput
                  style={[styles.inlineInput, { color: text }]}
                  keyboardType="decimal-pad"
                  value={sampleA}
                  onChangeText={setSampleA}
                  placeholder="0.123"
                  placeholderTextColor={textSecondary}
                  editable={!bootstrapping}
                />
              </View>
              <ThemedText style={{ marginTop: 6 }}>
                c estimada:{" "}
                <ThemedText style={{ fontWeight: "700" }}>
                  {estimatedC.toFixed(4)}
                </ThemedText>
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

/* ===================== Auxiliares UI ===================== */
const ToolbarButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.toolBtn}>
    <ThemedText style={styles.toolLabel}>{label}</ThemedText>
  </TouchableOpacity>
);

// Galeria de anexos
function AttachmentGallery({
  attachments,
  border,
  onRemove,
}: {
  attachments: Attachment[];
  border: string;
  onRemove: (id: string) => void;
}) {
  const images = attachments.filter((a) => a.kind === "image");
  const others = attachments.filter((a) => a.kind !== "image");

  return (
    <View style={{ gap: 10 }}>
      {!!images.length && (
        <View style={styles.galleryWrap}>
          {images.map((img) => (
            <View key={img.id} style={styles.thumbWrap}>
              <Image
                source={{ uri: img.uri }}
                style={styles.thumb}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.thumbRemove}
                onPress={() => onRemove(img.id)}>
                <ThemedText style={{ fontSize: 12 }}>×</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {!!others.length && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {others.map((a) => (
            <View key={a.id} style={styles.fileChip}>
              <ThemedText style={{ fontSize: 12 }}>
                [{a.kind.toUpperCase()}] {a.name}
              </ThemedText>
              <TouchableOpacity onPress={() => onRemove(a.id)}>
                <ThemedText style={{ marginLeft: 6, opacity: 0.7 }}>
                  ×
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/* ===================== Estilos ===================== */
const styles = StyleSheet.create({
  titleInput: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    marginRight: 8,
    flex: 1,
  },

  // topo: salvar / apagar / menu
  saveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(209, 26, 42, 0.25)",
    backgroundColor: "rgba(209, 26, 42, 0.06)",
  },
  overflowBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },

  // dropdown Android
  menuBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  menuCard: {
    position: "absolute",
    right: 0,
    top: 42,
    minWidth: 240,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    zIndex: 20,
  },
  menuHeader: { fontWeight: "700", paddingVertical: 8, paddingHorizontal: 10 },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginBottom: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  menuEmoji: { width: 20, textAlign: "center", marginRight: 6 },
  menuItemText: { fontSize: 14 },

  // Editor com a mesma cor do fundo
  editorContainer: {
    borderRadius: BorderRadius.lg,
    padding: Padding.md,
    marginBottom: Spacing.lg,
    backgroundColor: "transparent",
  },

  // cards de task/analysis
  card: {
    borderRadius: BorderRadius.lg,
    padding: Padding.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    backgroundColor: "transparent",
  },

  // editor “overlay”
  contentInputOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    minHeight: 220,
    padding: 0,
    includeFontPadding: false as any,
    backgroundColor: "transparent",
  },

  // toolbar inferior
  bottomToolbar: {
    flexDirection: "row",
    gap: 8,
    marginTop: Spacing.md,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  toolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  toolLabel: { fontSize: 14, fontWeight: "700" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 6,
    columnGap: 12,
  },
  th: { width: 100, fontWeight: "600" },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    marginBottom: 8,
  },
  tdInput: {
    width: 100,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },

  row: { flexDirection: "row", alignItems: "center" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipLabel: { fontSize: 12, opacity: 0.7 },
  chipInput: { minWidth: 80, paddingVertical: 2 },

  inlineInput: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 120,
  },

  separator: { height: 1, marginVertical: Spacing.sm },
  addBtn: {
    alignSelf: "flex-start",
    padding: Padding.sm,
    marginTop: Spacing.md,
  },

  // tags
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagPill: {
    backgroundColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  // galeria
  galleryWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  thumbWrap: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  thumb: { width: "100%", height: "100%" },
  thumbRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  fileChip: {
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  // botões pequenos
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  smallBtnText: { fontWeight: "600" },
});
