import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Note } from "@/src/storage/notesStorage"; // Apenas o 'Note' é importado
import { FlaskConical, ListChecks, Notebook } from "lucide-react-native";
import { MotiView } from "moti";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

// --- INÍCIO DA CORREÇÃO ---
// Definimos a estrutura do bloco de conteúdo localmente, pois ela não é exportada.
interface NoteContentBlock {
  type: "text" | "checklist" | string; // Adicionamos outros tipos possíveis
  value: any;
}
// --- FIM DA CORREÇÃO ---

interface NoteListItemProps {
  item: Note;
  onPress: () => void;
  index: number;
}

const formatDate = (date: Date) => {
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffDays = Math.floor(diffSeconds / 86400);

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

const getContentPreview = (content: string) => {
  try {
    const parsedContent: NoteContentBlock[] = JSON.parse(content);
    const textBlock = parsedContent.find((block) => block.type === "text");
    return textBlock?.value || "Nenhum conteúdo de texto...";
  } catch (error) {
    return "Nota sem texto de preview.";
  }
};

export function NoteListItem({ item, onPress, index }: NoteListItemProps) {
  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");

  const getIcon = () => {
    switch (item.type) {
      case "analysis":
        return <FlaskConical size={20} color={textSecondary} />;
      case "task":
        return <ListChecks size={20} color={textSecondary} />;
      default:
        return <Notebook size={20} color={textSecondary} />;
    }
  };

  const contentPreview = getContentPreview(item.content);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300, delay: index * 50 }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardColor }]}
        onPress={onPress}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <View style={styles.textContainer}>
          <ThemedText
            style={[styles.title, { color: textColor }]}
            numberOfLines={1}>
            {item.title || "Nota sem título"}
          </ThemedText>
          <ThemedText
            style={[styles.preview, { color: textSecondary }]}
            numberOfLines={1}>
            {contentPreview}
          </ThemedText>
        </View>
        <ThemedText style={[styles.date, { color: textSecondary }]}>
          {formatDate(new Date(item.updatedAt))}
        </ThemedText>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    width: "100%",
  },
  iconContainer: {
    marginRight: Margin.md,
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
  },
  preview: {
    fontSize: FontSize.md,
    marginTop: 2,
  },
  date: {
    fontSize: FontSize.sm,
    marginLeft: Margin.sm,
  },
});
