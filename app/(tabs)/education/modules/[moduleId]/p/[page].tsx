import { ContentBlockRenderer } from "@/components/modules/ContentBlockRenderer";
import { ModulePageNavigation } from "@/components/modules/ModulePageNavigation";
import { Colors } from "@/constants/Colors";
import {
  getModuleById,
  getModulePageById,
  getNextPage,
  getPreviousPage,
} from "@/utils/module-helpers";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

const ModuleContentPage: React.FC = (): React.ReactElement | null => {
  const params = useLocalSearchParams<{ moduleId: string; page: string }>();
  const scrollRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [params.page]);

  if (!params.moduleId || !params.page) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.heading1}>Erro de Navegação</Text>
        <Text>
          Não foi possível encontrar os parâmetros do módulo ou da página.
        </Text>
      </View>
    );
  }

  const { moduleId, page: pageId } = params;
  const module = getModuleById(moduleId);
  const pageContent = getModulePageById(moduleId, pageId);
  const nextPage = getNextPage(moduleId, pageId);
  const prevPage = getPreviousPage(moduleId, pageId);

  if (!module || !pageContent) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundIcon}>🚧</Text>
        <Text style={styles.heading1}>Conteúdo não encontrado!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{module.title}</Text>
          <Text style={styles.pageTitle}>{pageContent.title}</Text>
        </View>

        {pageContent.content.map((block) => (
          <ContentBlockRenderer key={block.id} block={block} />
        ))}
      </ScrollView>

      <ModulePageNavigation
        moduleId={moduleId}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </SafeAreaView>
  );
};

export default ModuleContentPage;

const styles = StyleSheet.create({
  pageContainer: { flex: 1, backgroundColor: theme.background },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 95 },
  header: { paddingTop: 24, marginBottom: 16 },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textSecondary,
    marginBottom: 8,
    paddingTop: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading1: {
    fontSize: 28,

    fontWeight: "bold",

    color: theme.textPrimary,

    marginBottom: 16,

    marginTop: 16,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: theme.accentPurple,
    marginBottom: 16,
  },
  errorPlaceholder: {
    backgroundColor: "rgba(255, 99, 132, 0.1)",
    borderColor: theme.pinkBackground,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
  },
  errorIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  errorTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.pink,
    textAlign: "center",
  },
  errorCaption: {
    fontSize: 14,
    color: theme.pink,
    marginTop: 6,
    textAlign: "center",
  },
  notFoundIcon: { fontSize: 48, marginBottom: 16 },
});
