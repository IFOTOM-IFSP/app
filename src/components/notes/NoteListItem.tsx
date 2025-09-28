import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import {
  getChecklistFlexible,
  pickText,
  shareNotePdf,
} from "@/src/features/notes/BuildPdfHtml";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Note } from "@/src/storage/notesStorage";
import { LinearGradient } from "expo-linear-gradient";
import { FlaskConical, ListChecks, Zap } from "lucide-react-native";
import { MotiView } from "moti";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

const formatDate = (d: string | number | Date) => {
  const date = new Date(d);
  const now = new Date();
  const diff = Math.floor((+now - +date) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

interface Props {
  item: Note;
  onPress: () => void;
  index: number;
}

export function NoteMasonryCard({ item, onPress, index }: Props) {
  const card = useThemeValue("card");
  const text = useThemeValue("text");
  const sub = useThemeValue("textSecondary");
  const border = useThemeValue("border");
  const primary = useThemeValue("primary") || "#A065C7"; // roxo

  const { items, total, pct, blocks } = getChecklistFlexible(item.content);
  const preview = pickText(blocks, item.content);

  const isTask = item.type === "task";
  const isAnalysis = item.type === "analysis";

  const TypeIcon = isTask ? (
    <ListChecks size={16} color={sub} />
  ) : isAnalysis ? (
    <FlaskConical size={16} color={sub} />
  ) : (
    <Zap size={16} color={sub} />
  );
  const typeLabel = isTask ? "Tarefa" : isAnalysis ? "Análise" : "Rápida";

  const handleLongPress = () => {
    const tasksArr = items.map(({ text, checked }) => ({
      text,
      checked: !!checked,
    }));
    shareNotePdf(item, blocks, tasksArr);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "timing", duration: 220, delay: index * 30 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onLongPress={handleLongPress}
        delayLongPress={300}
        style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <LinearGradient
          colors={[
            "rgba(160,101,199,0.25)",
            "rgba(160,101,199,0.10)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.accent}
        />

        <View style={styles.header}>
          <View
            style={[
              styles.pill,
              {
                borderColor: "rgba(160,101,199,0.35)",
                backgroundColor: "rgba(160,101,199,0.14)",
              },
            ]}>
            {TypeIcon}
            <ThemedText style={[styles.pillText, { color: sub }]}>
              {typeLabel}
            </ThemedText>
          </View>
          <ThemedText style={[styles.date, { color: sub }]}>
            {formatDate(item.updatedAt)}
          </ThemedText>
        </View>

        <ThemedText style={[styles.title, { color: text }]} numberOfLines={2}>
          {item.title || "Nota sem título"}
        </ThemedText>

        {isTask && total > 0 ? (
          <>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: "rgba(160,101,199,0.18)" },
              ]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${pct}%`, backgroundColor: primary },
                ]}
              />
            </View>

            <View style={{ marginTop: 10, gap: 8 }}>
              {items.slice(0, 3).map((it, i) => (
                <View key={i} style={styles.checkRow}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: "rgba(160,101,199,0.5)",
                        backgroundColor: it.checked
                          ? "rgba(160,101,199,0.16)"
                          : "transparent",
                      },
                    ]}>
                    {it.checked ? (
                      <View
                        style={[styles.dot, { backgroundColor: primary }]}
                      />
                    ) : null}
                  </View>
                  <ThemedText
                    numberOfLines={1}
                    style={{
                      color: it.checked ? sub : text,
                      textDecorationLine: it.checked ? "line-through" : "none",
                      opacity: it.checked ? 0.7 : 1,
                      fontSize: 13,
                    }}>
                    {it.text}
                  </ThemedText>
                </View>
              ))}
              {total > 3 && (
                <ThemedText style={{ color: sub, fontSize: 12 }}>
                  +{total - 3} tarefas
                </ThemedText>
              )}
            </View>
          </>
        ) : !!preview ? (
          <ThemedText
            style={[styles.preview, { color: sub }]}
            numberOfLines={isAnalysis ? 3 : 3}>
            {preview}
          </ThemedText>
        ) : null}
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: BorderRadius.md,
    padding: Padding.md,
    borderWidth: 0.4,
    overflow: "hidden",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 0.4,
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.45,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Margin.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    marginRight: 8,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  date: {
    marginLeft: "auto",
    fontSize: 12,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    marginBottom: 6,
  },
  preview: {
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  checkRow: { flexDirection: "row", alignItems: "center", columnGap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
