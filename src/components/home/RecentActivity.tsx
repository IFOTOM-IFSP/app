import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/src/constants/Styles";
import { Note } from "@/src/storage/notesStorage";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotesActivityCard from "./NotesActivityCard";

interface RecentActivityProps {
  notes: Note[];
  isLoading: boolean;
}

export function RecentActivity({ notes, isLoading }: RecentActivityProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const listLabel = "Últimas notas";
  const [containerH, setContainerH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const isScrollable = contentH > containerH + 1;
  const bottomPad = useMemo(
    () => (isScrollable ? insets.bottom + Padding.lg : 0),
    [isScrollable, insets.bottom]
  );
  const three = useMemo(() => notes.slice(0, 3), [notes]);

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText>Nenhuma nota encontrada.</ThemedText>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{listLabel}</ThemedText>
      </View>

      <Animated.View
        style={[styles.listWrapper, { opacity: fadeAnim }]}
        onLayout={(e) => setContainerH(e.nativeEvent.layout.height)}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={three}
            keyExtractor={(it) => `n-${it.id}`}
            renderItem={({ item }) => <NotesActivityCard note={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={isScrollable}
            nestedScrollEnabled
            ListEmptyComponent={<EmptyState></EmptyState>}
            onContentSizeChange={(_, h) => setContentH(h)}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: bottomPad }}
            ListFooterComponent={
              isScrollable ? (
                <View style={{ height: insets.bottom + 45 }} />
              ) : null
            }
            scrollIndicatorInsets={
              isScrollable ? { bottom: insets.bottom + 2 } : { bottom: 0 }
            }
            removeClippedSubviews
            initialNumToRender={8}
            windowSize={10}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Margin.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    marginBottom: Margin.sm,
  },
  listWrapper: { flex: 1 },
  separator: { height: 8 },
  emptyContainer: {
    padding: Padding.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
});
