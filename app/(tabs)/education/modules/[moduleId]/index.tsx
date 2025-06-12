import { getModuleById } from "@/utils/module-helpers";
import { Link, router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PageListItem } from "@/components/modules/modulesId/PageListItem";
import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";

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

  const currentIdAsNumber = parseInt(moduleId || "0", 10);
  const nextModule = getModuleById(String(currentIdAsNumber + 1));

  const firstPageId = module.pages[0]?.id || "1";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <BackButton onPress={() => router.replace("/education/modules")} />
        <Text style={styles.title} numberOfLines={1}>
          {module.title}
        </Text>
      </View>
      <Text style={styles.description}>
        Este é o início do módulo. Escolha uma página:
      </Text>

      {module.pages.map((page, index) => (
        <PageListItem
          key={page.id}
          page={page}
          moduleId={module.id}
          displayNumber={index + 1}
        />
      ))}

      <View style={styles.buttonContainer}>
        <Link
          href={{
            pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
            params: { moduleId: module.id, page: firstPageId },
          }}
          asChild>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Começar Módulo</Text>
          </TouchableOpacity>
        </Link>

        {nextModule && (
          <Link
            href={{
              pathname: "/(tabs)/education/modules/[moduleId]/",
              params: { moduleId: nextModule.id },
            }}
            asChild>
            <TouchableOpacity style={styles.nextModuleButton}>
              <Text style={styles.nextModuleButtonText}>Próximo Módulo</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: Colors.light.textSecondary,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  startButton: {
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  startButtonText: {
    fontSize: 16,
    color: Colors.light.background,
    fontWeight: "bold",
  },
  nextModuleButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.tint,
  },
  nextModuleButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
