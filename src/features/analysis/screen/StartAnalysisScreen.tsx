import { TYPES_ANALYSIS_DATA } from "@/data/analysisData";
import { useThemeValue } from "@/hooks/useThemeValue";
import AnalysisInfoModal from "@/src/components/analysis/modalTypes";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import BackButton from "@/src/components/ui/BackButton";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAnalysisFlowActions } from "../analysisFlowContext";

export default function AnalysisStart() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAnalysisIndex, setSelectedAnalysisIndex] = useState(0);
  const { startAnalysis } = useAnalysisFlowActions();
  const backgroundColor = useThemeValue("card");
  const text = useThemeValue("text");
  const tint = useThemeValue("tint");

  const handleStartAnalysis = (analysisType: string) => {
    startAnalysis(analysisType);
  };

  const openInfoModal = (index: number) => {
    setSelectedAnalysisIndex(index);
    setModalVisible(true);
  };

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
                {
                  backgroundColor,
                },
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
      <AnalysisInfoModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        data={TYPES_ANALYSIS_DATA}
        initialIndex={selectedAnalysisIndex}
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
});
