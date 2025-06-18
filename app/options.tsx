import { UsefulSections } from "@/components/home/UsefulSections";
import BackButton from "@/components/ui/BackButton";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function OptionsScreen() {
  const router = useRouter();
  const items = [
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
      onPress: async () => {
        console.log("Mais Opções Pressionado");
        await Linking.openURL(
          "https://icons.expo.fyi/Index/MaterialIcons/autorenew"
        );
      },
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Opções</Text>
      </View>
      <UsefulSections style={styles.sections} title={false} sections={items} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    flexGrow: 3 / 4,
  },
  text: { fontSize: 20 },
  sections: {
    flexWrap: "wrap",
  },
});
