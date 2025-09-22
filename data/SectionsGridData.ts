import { SectionItem } from "@/src/components/common/SectionsGrid";
import { openURL } from "@/src/utils/linkingUtils";

export const Sections_Grid_DATA: SectionItem[] = 
 [
      {
        id: "espectrofototometros",
        label: "Espectrofotômetros",
        iconName: "camera-document",
        iconLibrary: "MaterialCommunityIcons",
        isHome: true,
        route: "/(stack)/spectrophotometry",
      },
      {
        id: "about",
        label: "Guia rápido",
        iconName: "running",
        iconLibrary: "FontAwesome5",
        route: "/(stack)/quick_guide",
        isHome: true,
      },
      {
        id: "doubts",
        label: "Dúvidas",
        iconName: "question",
        iconLibrary: "SimpleLineIcons",
        route: "/(stack)/doubts",
        isHome: true
      },
      {
        id: "more",
        label: "Mais",
        iconName: "options",
        iconLibrary: "SimpleLineIcons",
        isHome: true,
        noOptions: true,
        route: "/(stack)/options",
      },
      {
        id: "ar-scan",
        label: "AR Scan",
        iconName: "vr-cardboard",
        iconLibrary: "FontAwesome5",
        isHome: false,
        onPress: () => console.log("AR Scan Pressionado"),
      },
      {
        id: "about",
        label: "Sobre",
        iconName: "exclamation",
        iconLibrary: "FontAwesome5",
        isHome: false,
        route: "/(stack)/about"
      },
      {
        id: "instagram",
        label: "Instagram",
        iconName: "instagram",
        iconLibrary: "MaterialCommunityIcons",
        isHome: false,
        onPress: () => openURL("https://www.instagram.com/ifotom.ifsp/"),
      },
  ]

