import {
  getModuleById,
  getModulePageById,
  getNextPage,
  getPreviousPage,
} from "@/utils/module-helpers";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ModuleContentPage() {
  const { moduleId, page: pageId } = useLocalSearchParams<{
    moduleId: string;
    page: string;
  }>();

  const module = getModuleById(moduleId);
  const pageContent = getModulePageById(moduleId, pageId);

  if (module) {
    console.log("[ModuleContentPage] Módulo pai encontrado:", module.title);
    if (pageContent) {
      console.log("[ModuleContentPage] Página encontrada:", pageContent.title);
    } else {
      console.log(
        "[ModuleContentPage] Página NÃO encontrada para ID:",
        pageId,
        "dentro do módulo:",
        module.title
      );
      console.log(
        "[ModuleContentPage] Páginas disponíveis neste módulo:",
        module.pages.map((p) => p.id)
      );
    }
  } else {
    console.log(
      "[ModuleContentPage] Módulo pai NÃO encontrado para ID:",
      moduleId
    );
  }

  if (!module || !pageContent) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red", fontWeight: "bold" }}>
          Conteúdo da página não encontrado!
        </Text>
        <Text>ID do Módulo Recebido: {moduleId || "Nenhum"}</Text>
        <Text>ID da Página Recebido: {pageId || "Nenhum"}</Text>
        {module && (
          <Text>
            Páginas Disponíveis neste Módulo:{" "}
            {module.pages.map((p) => `'${p.id}'`).join(", ")}
          </Text>
        )}
        {!module && <Text>Verifique se o ID do módulo está correto.</Text>}
        <Link
          href={`/(tabs)/education/modules/${moduleId || ""}`}
          style={styles.navLink}>
          Voltar ao Módulo
        </Link>
      </View>
    );
  }

  const nextPage = getNextPage(moduleId, pageId);
  const prevPage = getPreviousPage(moduleId, pageId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Módulo: {module.title}</Text>
      <Text style={styles.pageTitle}>
        Página {pageId}: {pageContent.title}
      </Text>
      <Text style={styles.contentText}>
        Conteúdo simulado para a página {pageId} do módulo {'"'} {module.title}{" "}
        {'"'}. Aqui iria o texto explicativo, imagens, diagramas, etc.
      </Text>

      <View style={styles.navigationContainer}>
        {prevPage ? (
          <Link
            href={{
              pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
              params: { moduleId, page: prevPage.id },
            }}
            style={styles.navLink}>
            Página Anterior ({prevPage.id})
          </Link>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {nextPage ? (
          <Link
            href={{
              pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
              params: { moduleId, page: nextPage.id },
            }}
            style={[styles.navLink, styles.navLinkRight]}>
            Próxima Página ({nextPage.id})
          </Link>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 16, color: "gray", marginBottom: 5 },
  pageTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  contentText: { fontSize: 16, lineHeight: 24, marginBottom: 30 },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navLink: { fontSize: 16, color: "navy", paddingVertical: 10, flex: 1 },
  navLinkRight: { textAlign: "right" },
});
