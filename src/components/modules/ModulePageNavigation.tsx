import { Button } from "@/components/ui/Button";
import { Padding, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ModulePage } from "@/models";
import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

type ModulePageNavigationProps = {
  moduleId: string;
  prevPage: ModulePage | null;
  nextPage: ModulePage | null;
};

export function ModulePageNavigation({
  moduleId,
  prevPage,
  nextPage,
}: ModulePageNavigationProps) {
  const router = useRouter();
  const tintColor = useThemeValue("tint");

  const secondaryButtonText = (
    <>
      <AntDesign name="arrowleft" size={14} color={tintColor} /> Anterior
    </>
  );

  return (
    <View style={styles.navigationContainer}>
      {prevPage ? (
        <Button
          title="Anterior"
          onPress={() => router.back()}
          variant="outline"
          style={styles.navButton}
          textStyle={{ color: tintColor }}
        />
      ) : (
        <View style={styles.navButton} />
      )}

      {nextPage ? (
        <Link
          href={{
            pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
            params: { moduleId, page: nextPage.id },
          }}
          asChild>
          <Button title="Próxima" onPress={() => {}} style={styles.navButton} />
        </Link>
      ) : (
        <Link replace href={`/(tabs)/education/modules/${moduleId}`} asChild>
          <Button
            title="Finalizar Módulo 🎉"
            onPress={() => {}}
            style={styles.navButton}
          />
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    paddingTop: Padding.sm,
    paddingBottom: Platform.OS === "ios" ? Padding.xl : Padding.md,
    backgroundColor: "transparent",
    gap: Spacing.sm,
  },
  navButton: {
    flex: 1,
  },
});
