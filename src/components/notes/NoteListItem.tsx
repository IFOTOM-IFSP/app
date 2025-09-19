import {
  BorderRadius,
  FontSize,
  FontWeight,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { Note } from "@/storage/notesStorage";
import { FlaskConical, ListChecks, Notebook } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ChecklistItem } from "./ChecklistItemRow";

interface NoteListItemProps {
  item: Note;
  onPress: () => void;
  variant?: "full" | "compact";
}

const getNoteTypeDetails = (note: Note, colors: any) => {
  if (note.type === "analysis") {
    return {
      icon: <FlaskConical size={14} color={colors.tagAnalysisText} />,
      text: "Análise",
      bgColor: colors.tagAnalysisBg,
      textColor: colors.tagAnalysisText,
    };
  }
  if (note.type === "task") {
    return {
      icon: <ListChecks size={14} color={colors.tagTaskText} />,
      text: "Lista de Tarefas",
      bgColor: colors.tagTaskBg,
      textColor: colors.tagTaskText,
    };
  }
  return {
    icon: <Notebook size={14} color={colors.tagQuickText} />,
    text: "Nota Rápida",
    bgColor: colors.tagQuickBg,
    textColor: colors.tagQuickText,
  };
};

function renderContentSummary(note: Note, textColor: string): React.ReactNode {
  if (note.type === "task") {
    try {
      const items = JSON.parse(note.content || "[]") as ChecklistItem[];
      if (!items || items.length === 0)
        return (
          <ThemedText style={{ color: textColor, fontStyle: "italic" }}>
            Checklist vazio
          </ThemedText>
        );
      const completed = items.filter((item) => item.isChecked).length;
      return (
        <ThemedText
          style={{
            color: textColor,
          }}>{`${completed} de ${items.length} tarefas concluídas`}</ThemedText>
      );
    } catch {
      return (
        <ThemedText style={{ color: textColor, fontStyle: "italic" }}>
          Conteúdo da tarefa inválido.
        </ThemedText>
      );
    }
  }
  return (
    <ThemedText style={{ color: textColor }} numberOfLines={2}>
      {note.content || "Nenhum conteúdo adicional"}
    </ThemedText>
  );
}

export function NoteListItem({
  item,
  onPress,
  variant = "full",
}: NoteListItemProps) {
  const colors = {
    card: useThemeValue("card"),
    textSecondary: useThemeValue("textSecondary"),
    tagAnalysisBg: useThemeValue("primaryBackground"),
    tagAnalysisText: useThemeValue("primary"),
    tagQuickBg: useThemeValue("pinkBackground"),
    tagQuickText: useThemeValue("pink"),
    tagTaskBg: useThemeValue("secondaryBackground"),
    tagTaskText: useThemeValue("secondary"),
  };
  const typeDetails = getNoteTypeDetails(item, colors);
  const isCompact = variant === "compact";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.noteItem,
        {
          backgroundColor: isCompact ? "transparent" : colors.card,
          padding: isCompact ? Padding.md : Padding.lg,
        },
      ]}>
      <View style={styles.header}>
        <ThemedText
          style={[styles.noteTitle, isCompact && styles.noteTitleCompact]}
          numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText style={[styles.noteDate, { color: colors.textSecondary }]}>
          {new Date(item.updatedAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          })}
        </ThemedText>
      </View>

      {isCompact ? (
        <View style={{ alignItems: "flex-start" }}>
          {/* <Tag
            size="sm"
            iconName={typeDetails.icon}
            text={typeDetails.text}
            backgroundColor={typeDetails.bgColor}
            textColor={typeDetails.textColor}
          /> */}
        </View>
      ) : (
        <>
          <View style={styles.noteContent}>
            {renderContentSummary(item, colors.textSecondary)}
          </View>
          <View style={styles.noteFooter}>
            <View style={styles.tagsContainer}>
              {/* <Tag
                icon={typeDetails.icon}
                text={typeDetails.text}
                backgroundColor={typeDetails.bgColor}
                textColor={typeDetails.textColor}
              /> */}
              {/* {item.type === "analysis" && item.analysisName && (
                // <Tag
                //   text={item.analysisName}
                //   // backgroundColor={colors.tagAnalysisBg}
                //   // textColor={colors.tagAnalysisText}
                // />
              )} */}
            </View>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  noteItemFull: {
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  noteItemCompact: {
    padding: Padding.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  noteContent: {
    fontSize: FontSize.md,
    minHeight: 38,
    justifyContent: "center",
    borderRadius: BorderRadius.lg,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    flex: 1,
    flexWrap: "wrap",
  },

  headerCompact: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteItem: { gap: Spacing.sm },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    flexShrink: 1,
    marginRight: Spacing.sm,
  },
  noteTitleCompact: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
  noteDate: { fontSize: FontSize.sm, fontWeight: "500" },
});
