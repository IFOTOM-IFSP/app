import { Feather } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import { glossaryData, GlossaryItem } from "@/constants/glossaryData";

// Habilita LayoutAnimation no Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Altura das seções do cabeçalho para o cálculo da animação
const HEADER_TITLE_HEIGHT = 70;
const SEARCH_FILTER_HEIGHT = 130;
const HEADER_HEIGHT = HEADER_TITLE_HEIGHT + SEARCH_FILTER_HEIGHT;

export default function GlossaryListScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("Todos");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const renderItem = ({ item }: { item: GlossaryItem }) => {
    const isExpanded = expandedItems.has(item.id);
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.termContainer}
          onPress={() => toggleItem(item.id)}>
          <Text style={styles.term}>{item.term}</Text>
          <Feather
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={22}
            color={Colors.light.textSecondary}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.definitionContainer}>
            <Text style={styles.definition}>{item.definition}</Text>
            <View style={styles.themeBadge}>
              <Text style={styles.themeBadgeText}>{item.theme}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Container do Cabeçalho Animado */}
      <Animated.View
        style={[
          styles.headerContainer,
          { transform: [{ translateY: headerTranslateY }] },
        ]}>
        {/* Título que desaparece */}
        <View style={styles.headerTitleContainer}>
          <BackButton />
          <Text style={styles.title}>Glossário</Text>
        </View>

        {/* Controles que permanecem */}
        <View style={styles.stickyControlsContainer}>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color={Colors.light.textSecondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar termo..."
              placeholderTextColor={Colors.light.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.themeScroll}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme}
                style={[
                  styles.themeButton,
                  selectedTheme === theme && styles.themeButtonActive,
                ]}
                onPress={() => setSelectedTheme(theme)}>
                <Text
                  style={[
                    styles.themeButtonText,
                    selectedTheme === theme && styles.themeButtonTextActive,
                  ]}>
                  {theme}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum termo encontrado.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 30,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    height: HEADER_TITLE_HEIGHT,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.light.text,
    marginLeft: 12,
  },
  stickyControlsContainer: {
    height: SEARCH_FILTER_HEIGHT,
    paddingTop: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginLeft: 8,
    color: Colors.light.text,
  },
  themeScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  themeButtonActive: {
    backgroundColor: Colors.light.accentPurple,
    borderColor: Colors.light.accentPurple,
  },
  themeButtonText: {
    color: Colors.light.text,
    fontWeight: "600",
  },
  themeButtonTextActive: {
    color: "#FFF",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    overflow: "hidden",
  },
  termContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  term: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  definitionContainer: {
    marginTop: 12,
  },
  definition: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  themeBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.accentPurple + "1A",
  },
  themeBadgeText: {
    color: Colors.light.accentPurple,
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
});
