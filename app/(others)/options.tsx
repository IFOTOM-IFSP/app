// src/screens/options.tsx

import { UsefulSections } from "@/components/common/UsefulSections"; // 1. Caminho atualizado após a promoção
import BackButton from "@/components/ui/BackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { openURL } from "@/utils/linkingUtils";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OptionRouter = ReturnType<typeof useRouter>;
const getOptionsItems = (router: OptionRouter) => [
  {
    id: "ar-scan",
    label: "AR Scan",
    iconName: "vr-cardboard",
    iconComponent: FontAwesome5,
    onPress: () => console.log("AR Scan Pressionado"),
  },
  {
    id: "about",
    label: "sobre",
    iconName: "exclamationcircleo",
    iconComponent: AntDesign,
    onPress: () => {
      console.log("Sobre Pressionado");
      router.push("/about");
    },
  },
  {
    id: "doubts",
    label: "Dúvidas",
    iconName: "question",
    iconComponent: SimpleLineIcons,
    onPress: () => {
      console.log("Dúvidas Pressionado");
      router.push("/doubts");
    },
  },
  {
    id: "article",
    label: "Artigos",
    iconName: "article",
    iconComponent: MaterialIcons,
    onPress: () => {
      console.log("Artigos recomendados Pressionado");
      router.push("/article");
    },
  },
  {
    id: "quick-guide",
    label: "Guia rápido",
    iconName: "run-fast",
    iconComponent: MaterialCommunityIcons,
    onPress: () => {
      console.log("Guia rápido Pressionado");
      router.push("/quick-guide");
    },
  },
  {
    id: "units-conversor",
    label: "Conversor de Unidades",
    iconName: "autorenew",
    iconComponent: MaterialCommunityIcons,
    onPress: () => {
      console.log("Conversor de Unidades Pressionado");
      router.push("/units-conversor");
    },
  },

  {
    id: "instagram",
    label: "Instagram",
    iconName: "instagram",
    iconComponent: MaterialCommunityIcons,
    onPress: () => openURL("https://www.instagram.com/ifsp.campinas/"),
  },
];

export default function OptionsScreen() {
  const router = useRouter();
  const backgroundColor = useThemeValue("background");
  const items = getOptionsItems(router);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <BackButton />
        <ThemedText style={styles.title}>Opções</ThemedText>
      </View>
      <UsefulSections style={styles.sections} title={false} sections={items} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Padding.lg, paddingHorizontal: Padding.xl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Padding.lg,
  },
  title: {
    fontSize: FontSize.lg,
    textAlign: "center",
    flexGrow: 3 / 4,
  },
  sections: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 0,
  },
});
