import { ErrorState } from "@/components/common/ErrorState";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { ContentBlockRenderer } from "@/components/specific/modules/ContentBlockRenderer";
import { ModulePageNavigation } from "@/components/specific/modules/ModulePageNavigation";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import {
  getModuleById,
  getModulePageById,
  getNextPage,
  getPreviousPage,
} from "@/utils/module-helpers";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ModuleContentPage(): React.ReactElement | null {
  const params = useLocalSearchParams<{ moduleId: string; page: string }>();
  const scrollRef = React.useRef<ScrollView>(null);
  const backgroundColor = useThemeValue("background");
  const textSecondaryColor = useThemeValue("textSecondary");
  const accentPurpleColor = useThemeValue("primary");

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [params.page]);

  if (!params.moduleId || !params.page) {
    return (
      <ErrorState
        title="Conteúdo Não Encontrado"
        message="A página que você está procurando não existe ou foi movida. Tente voltar para a lista de módulos."
      />
    );
  }

  const { moduleId, page: pageId } = params;
  const module = getModuleById(moduleId);
  const pageContent = getModulePageById(moduleId, pageId);
  const nextPage = getNextPage(moduleId, pageId);
  const prevPage = getPreviousPage(moduleId, pageId);

  if (!module || !pageContent) {
    return (
      <ErrorState
        title="Conteúdo Não Encontrado"
        message="A página que você está procurando não existe ou foi movida. Tente voltar para a lista de módulos."
      />
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Padding.lg }}>
        <View style={styles.header}>
          <ThemedText
            style={[styles.headerTitle, { color: textSecondaryColor }]}>
            {module.title}
          </ThemedText>
          <ThemedText style={[styles.pageTitle, { color: accentPurpleColor }]}>
            {pageContent.title}
          </ThemedText>
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Margin.md,
  },
  headerTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.sm,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.lg,
  },
  heading1: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
    marginTop: Margin.md,
  },
  pageTitle: {
    fontSize: FontSize.displaySm,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
  },
});
