import TitleSection from "@/src/components/common/TitleSection";
import { UsefulSections } from "@/src/components/common/UsefulSections";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { openURL } from "@/src/utils/linkingUtils";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

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
    onPress: () => openURL("https://www.instagram.com/ifotom.ifsp/"),
  },
];

export default function OptionsScreen() {
  const router = useRouter();
  const items = getOptionsItems(router);

  return (
    <ScreenLayout>
      <TitleSection title="Mais opções" />
      <UsefulSections style={styles.sections} title={false} sections={items} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sections: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    gap: 0,
  },
});
