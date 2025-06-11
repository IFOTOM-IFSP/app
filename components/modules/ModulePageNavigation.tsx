// src/components/navigation/ModulePageNavigation.tsx

import { Colors } from "@/constants/Colors";
import { ModulePage } from "@/interfaces/content";
import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const theme = Colors.light;

type ModulePageNavigationProps = {
  moduleId: string;
  prevPage: ModulePage | null;
  nextPage: ModulePage | null;
};

export const ModulePageNavigation: React.FC<ModulePageNavigationProps> = ({
  moduleId,
  prevPage,
  nextPage,
}) => {
  const router = useRouter();

  return (
    <View style={styles.navigationContainer}>
      {prevPage ? (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navButtonSecondary}>
          <Text style={styles.navButtonTextSecondary}>
            <AntDesign name="arrowleft" size={14} color={theme.textPrimary} />{" "}
            Anterior
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {nextPage ? (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
              params: { moduleId, page: nextPage.id },
            })
          }
          style={styles.navButtonPrimary}>
          <Text style={styles.navButtonTextPrimary}>
            Próxima{" "}
            <AntDesign name="arrowright" size={14} color={theme.buttonText} />
          </Text>
        </TouchableOpacity>
      ) : (
        <Link
          replace
          href={`/(tabs)/education/modules/${moduleId}`}
          style={styles.navButtonPrimary}>
          <Text style={styles.navButtonTextPrimary}>Finalizar Módulo 🎉</Text>
        </Link>
      )}
    </View>
  );
};

// Estilos de navegação agora vivem aqui
const styles = StyleSheet.create({
  navigationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "transparent",
  },

  navButtonPrimary: {
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 20, // Antes era 24
    borderRadius: 28, // Um pouco menor para combinar
    backgroundColor: theme.accentPurple,
    shadowColor: theme.accentPurple,
    shadowOffset: { width: 0, height: 4 }, // Sombra um pouco mais sutil
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  navButtonTextPrimary: {
    color: theme.buttonText,
    fontSize: 16, // Antes era 16
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonSecondary: {
    flex: 1,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12, // Antes era 16
    paddingHorizontal: 20, // Antes era 24
    borderRadius: 28,
    backgroundColor: theme.cardBackground,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navButtonTextSecondary: {
    color: theme.textSecondary,
    fontSize: 16, // Antes era 16
    fontWeight: "600",
  },
});
