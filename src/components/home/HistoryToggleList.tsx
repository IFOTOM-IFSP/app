import { SwitchRow } from "@/src/components/ui/SwitchRow";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";

import { Note } from "@/storage/notesStorage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface HistoryToggleListProps {
  notes: Note[];
  // analyses: SavedAnalysis[];
  isLoading: boolean;
}

export function HistoryToggleList({
  notes,
  // analyses,
  isLoading,
}: HistoryToggleListProps) {
  const [showAnalyses, setShowAnalyses] = useState(() => notes.length === 0);
  const router = useRouter();
  const cardColor = useThemeValue("card");
  const backgroundToastColor = useThemeValue("primary");
  const textSecondaryColor = useThemeValue("textSecondary");
  const border = useThemeValue("border");
  const shadowColor = useThemeValue("shadow");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeOut = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(callback);
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleChange = (wantsToShowAnalyses: boolean) => {
    if (wantsToShowAnalyses === showAnalyses) return;

    // if (wantsToShowAnalyses && analyses.length === 0) {
    //   setToastMessage("Não há análises no histórico.");
    //   setTimeout(() => setToastMessage(null), 1000);
    //   return;
    // }
    if (!wantsToShowAnalyses && notes.length === 0) {
      setToastMessage("Nenhuma nota encontrada.");
      setTimeout(() => setToastMessage(null), 1000);
      return;
    }

    fadeOut(() => {
      setShowAnalyses(wantsToShowAnalyses);
      fadeIn();
    });
  };

  // const data = showAnalyses ? analyses : notes;
  const listLabel = showAnalyses ? "Últimas análises" : "Últimas notas";

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText>Nenhum item encontrado.</ThemedText>
    </View>
  );

  return (
    <View>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{listLabel}</ThemedText>
        <SwitchRow
          label={showAnalyses ? "Análises" : "Notas"}
          value={showAnalyses}
          onValueChange={handleToggleChange}
        />
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {/* {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <View style={[styles.listContainer, {}]}>
            {data.length > 0 ? (
              data.slice(0, 5).map((item, index) => (
                <View key={`${showAnalyses ? "a" : "n"}-${item.id}`}>
                  {showAnalyses ? (
                    <AnalysisHistoryItem
                      item={item as SavedAnalysis}
                      variant="compact"
                    />
                  ) : (
                    <NoteListItem
                      item={item as Note}
                      onPress={() => router.push(`/notes/${item.id}`)}
                      variant="compact"
                    />
                  )}
                  {index < data.slice(0, 5).length - 1 && (
                    <View
                      style={[styles.separator, { backgroundColor: border }]}
                    />
                  )}
                </View>
              ))
            ) : (
              <EmptyState />
            )}
          </View>
        )} */}
      </Animated.View>

      {toastMessage && (
        <View style={styles.toastOverlay}>
          <Animated.View
            style={[
              styles.toastBubble,
              {
                opacity: fadeAnim,
                backgroundColor: backgroundToastColor,
                shadowColor: shadowColor,
              },
            ]}>
            <ThemedText style={styles.toastText}>{toastMessage}</ThemedText>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Padding.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
  },
  listContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  separator: {
    height: 2,
    marginHorizontal: Padding.md,
  },
  emptyContainer: {
    padding: Padding.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  emptySubtitle: {
    marginTop: 4,
  },

  toastOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  toastBubble: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },
});
