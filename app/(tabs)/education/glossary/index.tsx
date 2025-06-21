import { GlossaryListItem } from "@/components/specific/glossary/GlossaryListItem";
import BackButton from "@/components/ui/BackButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { glossaryData } from "@/data/glossaryData";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HEADER_TITLE_HEIGHT = 70;
const SEARCH_FILTER_HEIGHT = 130;
const HEADER_HEIGHT = HEADER_TITLE_HEIGHT + SEARCH_FILTER_HEIGHT;

export default function GlossaryListScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("Todos");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const scrollY = useRef(new Animated.Value(0)).current;

  const bgColor = useThemeValue("background");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const accentColor = useThemeValue("accentPurple");
  const buttonText = useThemeValue("buttonText");
  const cardBg = useThemeValue("cardBackground");
  const borderColor = useThemeValue("borderColor");

  const themes = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set(glossaryData.map((item) => item.theme))),
    ],
    []
  );

  const toggleItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);

    setExpandedItems(newSet);
  };

  const filteredData = useMemo(() => {
    return glossaryData

      .filter((item) => {
        const themeMatch =
          selectedTheme === "Todos" || item.theme === selectedTheme;

        const searchMatch = item.term

          .toLowerCase()

          .includes(searchTerm.toLowerCase());

        return themeMatch && searchMatch;
      })

      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedTheme]);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_TITLE_HEIGHT],
    outputRange: [0, -HEADER_TITLE_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.headerContainer,
            {
              backgroundColor: bgColor,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}>
          <View style={styles.headerTitleContainer}>
            <BackButton />
            <ThemedText style={[styles.title, { color: textColor }]}>
              Glossário
            </ThemedText>
          </View>
          <View style={styles.stickyControlsContainer}>
            <View
              style={[
                styles.searchContainer,
                { backgroundColor: cardBg, borderColor },
              ]}>
              <Feather name="search" size={20} color={textSecondary} />
              <ThemedInput
                style={styles.searchInput}
                placeholder="Buscar termo..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.themeScroll}>
              {themes.map((theme) => {
                const isActive = selectedTheme === theme;
                return (
                  <TouchableOpacity
                    key={theme}
                    style={[
                      styles.themeButton,
                      { backgroundColor: cardBg, borderColor },
                      isActive && {
                        backgroundColor: accentColor,
                        borderColor: accentColor,
                      },
                    ]}
                    onPress={() => setSelectedTheme(theme)}>
                    <ThemedText
                      style={[
                        styles.themeButtonText,
                        { color: isActive ? buttonText : textColor },
                      ]}>
                      {theme}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>

        <Animated.FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GlossaryListItem
              item={item}
              isExpanded={expandedItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          )}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT,
            paddingHorizontal: Padding.md,
            paddingBottom: Padding.lg,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
                Nenhum termo encontrado.
              </ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: Padding.xl,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    paddingTop: Padding.md,
    paddingBottom: Padding.sm,
    height: HEADER_TITLE_HEIGHT,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginLeft: Margin.sm,
  },
  stickyControlsContainer: {
    height: SEARCH_FILTER_HEIGHT,
    paddingTop: Padding.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Margin.md,
    paddingHorizontal: Padding.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Padding.sm,
    fontSize: FontSize.md,
    marginLeft: Margin.sm,
    borderWidth: 0,
    textAlign: "left",
  },
  themeScroll: {
    paddingHorizontal: Padding.md,
    paddingVertical: Padding.md,
  },
  themeButton: {
    paddingHorizontal: Padding.md,
    borderRadius: BorderRadius.full,
    marginRight: Margin.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themeButtonText: { fontWeight: FontWeight.semiBold },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: FontSize.md },
});
