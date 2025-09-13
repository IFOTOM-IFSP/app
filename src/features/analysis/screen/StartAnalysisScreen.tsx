import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { TYPES_ANALYSIS_DATA } from "@/data/analysisData";
import { useThemeValue } from "@/hooks/useThemeValue";
import AnalysisInfoModal from "@/src/components/analysis/modalTypes";
import TitleSection from "@/src/components/common/TitleSection";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useAnalysisFlowActions } from "@/src/features/analysis/analysisFlowContext";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function StartAnalysisScreen() {
  const { startAnalysis } = useAnalysisFlowActions();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAnalysisIndex, setSelectedAnalysisIndex] = useState(0);

  const cardBackgroundColor = useThemeValue("card");
  const tintColor = useThemeValue("tint");
  const textSecondaryColor = useThemeValue("textSecondary");
  const shadowColor = useThemeValue("shadow");
  const disabledBgColor = useThemeValue("disabledBackground");

  const handleStartAnalysis = (analysisType: string) => {
    startAnalysis(analysisType);
  };

  const openInfoModal = (index: number) => {
    setSelectedAnalysisIndex(index);
    setModalVisible(true);
  };

  return (
    <ScreenLayout>
      <TitleSection
        title="Tipo de Análise"
        subtitle="Para começar, escolha o que você quer fazer."
      />

      <View style={styles.buttonContainer}>
        {TYPES_ANALYSIS_DATA.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.buttonRow,
              { backgroundColor: cardBackgroundColor, shadowColor },
              !item.enabled && { backgroundColor: disabledBgColor },
            ]}
            disabled={!item.enabled}
            onPress={() => handleStartAnalysis(item.id)}
            activeOpacity={0.8}>
            <View
              style={[styles.iconContainer, { backgroundColor: tintColor }]}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={32}
                color={"white"}
              />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.buttonText}>{item.title}</ThemedText>
              <ThemedText
                style={[styles.buttonSubtext, { color: textSecondaryColor }]}>
                {item.subtitle}
              </ThemedText>
            </View>
            <TouchableOpacity
              style={styles.infoIcon}
              onPress={() => openInfoModal(index)}>
              <Feather name="info" size={24} color={textSecondaryColor} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <AnalysisInfoModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        data={TYPES_ANALYSIS_DATA}
        initialIndex={selectedAnalysisIndex}
      />
      <Image
        source={require("@/assets/images/m_set_type.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: Margin.md,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Margin.md,
    borderRadius: BorderRadius.lg,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: Padding.md,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: Padding.md,
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
  },
  buttonSubtext: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  infoIcon: {
    padding: Padding.md,
  },
  image: {
    position: "absolute",
    bottom: -20,
    left: -150,
    width: "100%",
    height: 250,
    opacity: 0.5,
    zIndex: -1,
  },
});
