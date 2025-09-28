import { Margin, Padding } from "@/src/constants/Styles";
import { getNotePreview } from "@/src/features/notes/notePreview";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Note } from "@/src/storage/notesStorage";
import { formatDateShort } from "@/src/utils/date";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../ui/icon/Icon";
import { ThemedText } from "../ui/ThemedText";

export interface NotesActivityCardProps {
  note: Note;
}

export default function NotesActivityCard({ note }: NotesActivityCardProps) {
  const cardBackground = useThemeValue("card");
  const iconContainer = useThemeValue("tint");
  const white = useThemeValue("textWhite");
  const gray = useThemeValue("textSecondary");

  const when = note.updatedAt ? formatDateShort(note.updatedAt) : "";
  const preview = getNotePreview(note); // <-- texto legível

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "(tabs)/notes/[id]",
          params: { id: String(note.id) }, // <-- garante string
        })
      }
      style={[styles.container, { backgroundColor: cardBackground }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconContainer }]}>
        {note.type === "task" && (
          <Icon
            library={"FontAwesome5"}
            name={"tasks"}
            color={white}
            size={26}
          />
        )}
        {note.type === "quick" && (
          <Icon
            library={"SimpleLineIcons"}
            name={"notebook"}
            color={white}
            size={26}
          />
        )}
        {note.type === "analysis" && (
          <Icon
            library={"MaterialCommunityIcons"}
            name={"chart-line"}
            color={white}
            size={26}
          />
        )}
      </View>

      <View style={styles.main}>
        <View style={styles.writeInfo}>
          <ThemedText style={styles.title}>{note.title}</ThemedText>

          {/* Mostra preview para quick/analysis; task você já omitia */}
          {note.type !== "task" && (
            <ThemedText
              style={[styles.contentText, { color: gray }]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {preview || " "}
            </ThemedText>
          )}

          <View
            style={[styles.typeContainer, { backgroundColor: iconContainer }]}>
            <Text style={[styles.type, { color: white }]}>
              {note.type === "analysis" && "Análise"}
              {note.type === "task" && "Tarefa"}
              {note.type === "quick" && "Rápida"}
            </Text>
          </View>
        </View>

        <View style={styles.others}>
          <ThemedText style={styles.date}>{when}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 85,
    flexDirection: "row",
    borderRadius: 6,
  },
  iconContainer: {
    width: "20%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  main: {
    flexDirection: "row",
    paddingTop: Padding.sm,
    flex: 1,
  },
  writeInfo: {
    flex: 1,
    height: "100%",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: Padding.sm,
    paddingRight: Padding.md,
  },
  title: { fontWeight: "600", paddingLeft: Padding.md }, // <-- string
  typeContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    height: 20,
    borderRadius: 8,
    marginLeft: Margin.md,
  },
  type: {
    fontSize: 10,
    padding: 2,
    fontWeight: "600", // <-- string
  },
  contentText: {
    paddingLeft: Padding.md,
    fontSize: 12,
    paddingBottom: 4,
  },
  others: {
    width: "26%",
  },
  date: {
    fontSize: 10,
    paddingHorizontal: 10,
  },
});
