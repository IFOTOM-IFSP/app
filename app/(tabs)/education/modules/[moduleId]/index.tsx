import { getModuleById } from "@/constants/modulesData";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ModuleHomeScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();

  const module = getModuleById(moduleId);

  if (!module) {
    return (
      <View style={styles.container}>
        <Text>Módulo não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Módulo: {module.title}</Text>
      <Text style={styles.description}>
        Este é o início do módulo. Escolha uma página:
      </Text>
      {module.pages.map((page, index) => (
        <Link
          key={page.id}
          href={{
            pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
            params: { moduleId: module.id, page: page.id },
          }}
          style={styles.link}>
          Página {page.id}: {page.title || `Conteúdo ${index + 1}`}
        </Link>
      ))}
      <Link
        href={{
          pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
          params: { moduleId: module.id, page: "1" },
        }}
        style={[styles.link, { marginTop: 20, fontWeight: "bold" }]}>
        Começar pela Página 1
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "flex-start" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 15 },
  link: { fontSize: 18, color: "blue", marginBottom: 8, paddingVertical: 5 },
});
