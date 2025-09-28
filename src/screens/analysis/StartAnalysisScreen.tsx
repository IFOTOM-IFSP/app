import { TYPES_ANALYSIS_DATA } from "@/data/analysisData";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import BackButton from "@/src/components/ui/BackButton";
import { InfoModal } from "@/src/components/ui/InfoModal";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ★ novo
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAnalysisMachine } from "../../features/analysis/AnalysisMachineProvider";

const parseCiteText = (text: string) => {
  if (!text) return "";
  return text.toString().replace("", "");
};

type AnalysisDataItem = {
  title: string;
  keyQuestion: string;
  explanation: string;
  howItWorks: string[];
  useCases: string[];
};

const ModalContent = ({ item }: { item: AnalysisDataItem | undefined }) => {
  if (!item) return null;

  return (
    <>
      <ThemedText style={styles.modalKeyQuestion}>
        "{item.keyQuestion}"
      </ThemedText>
      <ThemedText style={styles.modalExplanation}>
        {item.explanation}
      </ThemedText>

      <ThemedText style={styles.modalSectionHeader}>Como funciona?</ThemedText>
      {item.howItWorks.map((step: string, index: number) => (
        <ThemedText key={index} style={styles.modalListItem}>
          • {parseCiteText(step)}
        </ThemedText>
      ))}

      <ThemedText style={styles.modalSectionHeader}>Casos de Uso</ThemedText>
      {item.useCases.map((useCase: string, index: number) => (
        <ThemedText key={index} style={styles.modalListItem}>
          • {useCase}
        </ThemedText>
      ))}
    </>
  );
};

export default function AnalysisStart() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAnalysisIndex, setSelectedAnalysisIndex] = useState(0);
  const backgroundColor = useThemeValue("card");
  const text = useThemeValue("text");
  const tint = useThemeValue("tint");
  const { state, send } = useAnalysisMachine(); // ★ pegar state também
  const router = useRouter(); // ★

  const openInfoModal = (index: number) => {
    setSelectedAnalysisIndex(index);
    setModalVisible(true);
  };

  // ★ navegação centralizada
  const goToParams = () => router.push("/analysis/params");

  // ★ fluxo robusto: garante CHOOSE_TYPE → PARAMS antes de navegar
  const handleStartAnalysis = (analysisType: string) => {
    if (analysisType !== "quantitative") return;

    if (state.matches("CHOOSE_TYPE")) {
      // caminho feliz: estamos no estado certo
      send({ type: "SELECT_TYPE", value: "quant" });
      goToParams();
      return;
    }

    if (state.matches("PARAMS")) {
      // já está em PARAMS (ex.: retorno de back), só navegar
      goToParams();
      return;
    }

    send({ type: "SELECT_TYPE", value: "quant" });
    goToParams();
  };

  const selectedAnalysisData = TYPES_ANALYSIS_DATA[selectedAnalysisIndex];

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <BackButton color={text} style={styles.baseContainer} />
        <View style={styles.headerTitleContainer}>
          <View style={[styles.stepBadge, { backgroundColor: tint }]}>
            <Text style={styles.stepBadgeText}>1</Text>
          </View>
          <ThemedText style={styles.headerTitle}>Tipo de Análise</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ThemedText style={styles.instructions}>
        Para começar, escolha o que você quer fazer.
      </ThemedText>

      <View>
        <View style={styles.buttonContainer}>
          {TYPES_ANALYSIS_DATA.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.buttonRow,
                !item.enabled && styles.disabledRow,
                { backgroundColor },
              ]}>
              <TouchableOpacity
                style={[styles.button, !item.enabled && styles.buttonDisabled]}
                disabled={!item.enabled}
                onPress={() => handleStartAnalysis(item.id)}
                activeOpacity={0.8}>
                <View style={[styles.iconContainer, { backgroundColor: tint }]}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={28}
                    color={"white"}
                  />
                </View>
                <View>
                  <ThemedText
                    style={[
                      styles.buttonText,
                      !item.enabled && styles.buttonTextDisabled,
                    ]}>
                    {item.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.buttonSubtext,
                      !item.enabled && styles.buttonTextDisabled,
                    ]}>
                    ({item.subtitle})
                  </ThemedText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.infoIcon}
                onPress={() => openInfoModal(index)}>
                <Feather name="info" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <InfoModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedAnalysisData?.title || ""}
        content={
          <ModalContent item={selectedAnalysisData as AnalysisDataItem} />
        }
      />

      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/m_set_type.png")}
          style={styles.image}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    marginBottom: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  baseContainer: {
    padding: 0,
    backgroundColor: "transparent",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  instructions: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    width: "90%",
  },
  buttonContainer: {
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 8,
  },
  disabledRow: {
    backgroundColor: "#c4c6c9af",
  },
  button: {
    flex: 1,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  buttonSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  buttonTextDisabled: {},
  infoIcon: {
    padding: 16,
  },
  imageContainer: {
    height: "43%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  image: {
    width: 140,
    height: 200,
    resizeMode: "contain",
  },
  modalKeyQuestion: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  modalExplanation: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
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
