import { getModuleById } from "@/utils/module-helpers";
import { Link, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { PageListItem } from "@/components/specific/modules/PageListItem";
import BackButton from "@/components/ui/BackButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  LayoutSize,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";

export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const tintColor = useThemeValue("tint");
  const buttonTextColor = useThemeValue("buttonText");
  const textColor = useThemeValue("text");
  const textSecondaryColor = useThemeValue("textSecondary");

  const module = getModuleById(moduleId);
  const nextModule = module?.nextModuleId
    ? getModuleById(module.nextModuleId)
    : null;

  if (!module) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Módulo não encontrado.</ThemedText>
      </ThemedView>
    );
  }

  const firstPageId = module.pages[0]?.id || "1";

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <BackButton
            onPress={() => router.replace("/(tabs)/education/modules")}
          />
          <ThemedText
            style={[styles.title, { color: textColor }]}
            numberOfLines={1}>
            {module.title}
          </ThemedText>
        </View>
        <ThemedText style={[styles.description, { color: textSecondaryColor }]}>
          Este é o início do módulo. Escolha uma página para começar a aprender:
        </ThemedText>

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
            <PrimaryButton title="Começar Módulo" onPress={() => {}} />
          </Link>

          {nextModule && (
            <Link
              href={{
                pathname: "/(tabs)/education/modules/[moduleId]/",
                params: { moduleId: nextModule.id },
              }}
              asChild>
              <PrimaryButton
                title={`Próximo Módulo: ${nextModule.title}`}
                variant="outline"
                onPress={() => {}}
              />
            </Link>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Padding.xxxxl,
    paddingHorizontal: Padding.md,
    paddingBottom: Padding.xl,
  },
  header: {
    minHeight: LayoutSize.buttonHeight,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Margin.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    flex: 1,
  },
  description: {
    fontSize: FontSize.md,
    marginBottom: Margin.xl,
  },
  buttonContainer: {
    marginTop: Margin.lg,
    gap: Spacing.md,
  },
  startButton: {
    alignItems: "center",
    paddingVertical: Padding.md,
    borderRadius: BorderRadius.lg,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  nextModuleButton: {
    alignItems: "center",
    paddingVertical: Padding.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
});
