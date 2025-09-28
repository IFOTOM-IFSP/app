// import { Margin, Padding } from "@/constants/Styles";
// import { INFO_CARD_DATA } from "@/data/analysisData";
// import { useThemeValue } from "@/hooks/useThemeValue";
// import AnalysisHeader from "@/src/components/analysis/dashboard/analysisHeader";
// import ButtonFooter from "@/src/components/analysis/dashboard/ButtonFooter";
// import CardMain from "@/src/components/analysis/dashboard/cardMain";
// import { InfoCard } from "@/src/components/analysis/dashboard/InfoCard";
// import { ThemedView } from "@/src/components/ui/ThemedView";
// import { useUserName } from "@/store/userStore";
// import { LinearGradient } from "expo-linear-gradient";
// import React from "react";
// import { ScrollView, StyleSheet, View } from "react-native";

// export default function AnalysisPage() {
//   const colorsGradient = useThemeValue("authGradient");
//   const colorsBackground = useThemeValue("card");
//   const name = useUserName();
//   const handleMenuPress = () => {
//     console.log("Menu button pressed");
//   };

//   return (
//     <ThemedView style={{ flex: 1 }}>
//       <LinearGradient colors={colorsGradient}>
//         <AnalysisHeader handleMenuPress={handleMenuPress} name={name} />
//         <CardMain />
//       </LinearGradient>
//       <ScrollView style={{ paddingHorizontal: Padding.lg }}>
//         <View style={styles.gridContainer}>
//           {INFO_CARD_DATA.map((item) => (
//             <InfoCard
//               title={item.title}
//               subtitle={item.subtitle}
//               largeNumber={item.largeNumber}
//               smallIcon={item.smallIcon}
//               route={item.route}
//               key={item.title}
//             />
//           ))}
//         </View>
//         <ButtonFooter />
//       </ScrollView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   gridContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",

//     paddingTop: Margin.md,
//     width: "100%",
//   },
// });

// app/analysis/start.tsx
import { TYPES_ANALYSIS_DATA } from "@/data/analysisData";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import BackButton from "@/src/components/ui/BackButton";
import { InfoModal } from "@/src/components/ui/InfoModal";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAnalysisMachine } from "../../features/analysis/AnalysisMachineProvider";

export default function AnalysisStart() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { send } = useAnalysisMachine();

  const backgroundColor = useThemeValue("card");
  const text = useThemeValue("text");
  const tint = useThemeValue("tint");

  const openInfoModal = (i: number) => {
    setSelectedIndex(i);
    setModalVisible(true);
  };
  const start = (id: string) => send({ type: "SELECT_TYPE", value: "quant" }); // por ora suportamos quant

  const item = TYPES_ANALYSIS_DATA[selectedIndex];

  return (
    <ScreenLayout>
      <View style={s.header}>
        <BackButton color={text} style={s.baseContainer} />
        <View style={s.headerTitleContainer}>
          <View style={[s.stepBadge, { backgroundColor: tint }]}>
            <Text style={s.stepBadgeText}>1</Text>
          </View>
          <ThemedText style={s.headerTitle}>Tipo de Análise</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ThemedText style={s.instructions}>
        Para começar, escolha o que você quer fazer.
      </ThemedText>

      <View style={s.buttonContainer}>
        {TYPES_ANALYSIS_DATA.map((it, i) => (
          <View
            key={it.id}
            style={[
              s.buttonRow,
              !it.enabled && s.disabledRow,
              { backgroundColor },
            ]}>
            <TouchableOpacity
              style={[s.button, !it.enabled && s.buttonDisabled]}
              disabled={!it.enabled}
              onPress={() => start(it.id)}>
              <View style={[s.iconContainer, { backgroundColor: tint }]}>
                <MaterialCommunityIcons
                  name={it.icon as any}
                  size={28}
                  color={"white"}
                />
              </View>
              <View>
                <ThemedText
                  style={[s.buttonText, !it.enabled && s.buttonTextDisabled]}>
                  {it.title}
                </ThemedText>
                <ThemedText
                  style={[
                    s.buttonSubtext,
                    !it.enabled && s.buttonTextDisabled,
                  ]}>
                  ({it.subtitle})
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.infoIcon}
              onPress={() => openInfoModal(i)}>
              <Feather name="info" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <InfoModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title={item?.title || ""}
        content={
          <>
            <ThemedText style={s.modalKeyQuestion}>
              "{item?.keyQuestion}"
            </ThemedText>
            <ThemedText style={s.modalExplanation}>
              {item?.explanation}
            </ThemedText>
            <ThemedText style={s.modalSectionHeader}>Como funciona?</ThemedText>
            {(item?.howItWorks || []).map((step, idx) => (
              <ThemedText key={idx} style={s.modalListItem}>
                • {step}
              </ThemedText>
            ))}
            <ThemedText style={s.modalSectionHeader}>Casos de Uso</ThemedText>
            {(item?.useCases || []).map((u, idx) => (
              <ThemedText key={idx} style={s.modalListItem}>
                • {u}
              </ThemedText>
            ))}
          </>
        }
      />

      <View style={s.imageContainer}>
        <Image
          source={require("@/assets/images/m_set_type.png")}
          style={s.image}
        />
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    marginBottom: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  baseContainer: { padding: 0, backgroundColor: "transparent" },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepBadgeText: { color: "white", fontWeight: "bold", fontSize: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  instructions: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    width: "90%",
  },
  buttonContainer: { width: "100%" },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 8,
  },
  disabledRow: { backgroundColor: "#c4c6c9af" },
  button: { flex: 1, height: 80, flexDirection: "row", alignItems: "center" },
  buttonDisabled: { backgroundColor: "transparent" },
  iconContainer: {
    paddingLeft: 20,
    paddingRight: 25,
    height: "100%",
    paddingVertical: 16,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    width: 80,
  },
  buttonText: { fontSize: 18, fontWeight: "600" },
  buttonSubtext: { fontSize: 14, marginTop: 2 },
  buttonTextDisabled: {},
  infoIcon: { padding: 16 },
  imageContainer: {
    height: "43%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  image: { width: 140, height: 200, resizeMode: "contain" },
  modalKeyQuestion: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  modalExplanation: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  modalSectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },
  modalListItem: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
    opacity: 0.9,
  },
});
