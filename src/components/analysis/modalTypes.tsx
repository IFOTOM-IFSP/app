import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Pega a largura da tela para o slider
const { width: screenWidth } = Dimensions.get("window");

const parseCiteText = (text) => {
  return text
    .toString()
    .replace("[cite_start]", "")
    .replace(/\[cite: \d+\]/g, "");
};

const AnalysisInfoCard = ({ item }) => (
  <View style={styles.slide}>
    <Text style={styles.infoKeyQuestion}>"{item.keyQuestion}"</Text>
    <Text style={styles.infoTitle}>{item.title}</Text>
    <Text style={styles.infoExplanation}>{item.explanation}</Text>

    <Text style={styles.sectionHeader}>Como funciona?</Text>
    {item.howItWorks.map((step, index) => (
      <Text key={index} style={styles.listItem}>
        • {parseCiteText(step)}
      </Text>
    ))}

    <Text style={styles.sectionHeader}>Casos de Uso</Text>
    {item.useCases.map((useCase, index) => (
      <Text key={index} style={styles.listItem}>
        • {useCase}
      </Text>
    ))}
  </View>
);

const AnalysisInfoModal = ({ visible, onClose, data, initialIndex }) => {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (visible && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          x: initialIndex * screenWidth,
          animated: false,
        });
      }, 10);
    }
  }, [visible, initialIndex]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x-circle" size={30} color="#9CA3AF" />
          </TouchableOpacity>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width: screenWidth }}>
            {data.map((item) => (
              <AnalysisInfoCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "85%",
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  slide: {
    width: screenWidth,
    padding: 24,
    paddingTop: 50,
  },
  infoKeyQuestion: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  infoExplanation: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 6,
  },
});

export default AnalysisInfoModal;
