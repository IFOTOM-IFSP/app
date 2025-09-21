import { getModuleById } from "@/utils/module-helpers";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import TitleSection from "@/src/components/common/TitleSection";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { PageListItem } from "@/src/components/modules/PageListItem";
import { Button } from "@/src/components/ui/Button";
import { ThemedText } from "@/src/components/ui/ThemedText";

export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();

  const module = getModuleById(moduleId);
  const nextModule = module?.nextModuleId
    ? getModuleById(module.nextModuleId)
    : null;

  if (!module) {
    return (
      <ScreenLayout>
        <ThemedText>Módulo não encontrado.</ThemedText>
      </ScreenLayout>
    );
  }

  const firstPageId = module.pages[0]?.id || "1";

  return (
    <ScreenLayout>
      <ScrollView>
        <TitleSection
          title={module.title}
          subtitle={module.description}
          routerPath="/(tabs)/education/modules"
          style={{ fontSize: FontSize.xl }}
        />

        {module.pages.map((page: any, index: any) => (
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
            <Button title="Começar Módulo" onPress={() => {}} />
          </Link>

          {nextModule && (
            <Link
              href={{
                pathname: "/(tabs)/education/modules/[moduleId]/",
                params: { moduleId: nextModule.id },
              }}
              asChild>
              <Button
                title={`Próximo Módulo: ${nextModule.title}`}
                variant="outline"
                onPress={() => {}}
              />
            </Link>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: Margin.lg,
    gap: Spacing.md,
    paddingBottom: 80,
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
