import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
// import { getAnalysisHistory, SavedAnalysis } from "@/storage/analysisStorage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { FlaskConical, ListChecks, Notebook, Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
  <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
    <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
  </Pressable>
);

const TemplateMenuModal = ({ isVisible, onClose, onSelect }: any) => {
  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");

  const templates = [
    {
      key: "quick",
      title: "Nota Rápida",
      icon: <Notebook size={24} color={textColor} />,
    },
    {
      key: "analysis",
      title: "Anotação de Análise",
      icon: <FlaskConical size={24} color={textColor} />,
    },
    {
      key: "task",
      title: "Lista de Tarefas",
      icon: <ListChecks size={24} color={textColor} />,
    },
  ];

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <ModalBackdrop onClose={onClose} />
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.modalTitle}>Criar Nova Nota</ThemedText>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.key}
              style={styles.templateButton}
              onPress={() => onSelect(template.key)}>
              {template.icon}
              <ThemedText style={styles.templateTitle}>
                {template.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

// const AnalysisSelectorModal = ({ isVisible, onClose, onSelect }: any) => {
//   const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const cardColor = useThemeValue("card");
//   const textColor = useThemeValue("text");

//   useEffect(() => {
//     if (isVisible) {
//       setIsLoading(true);
//       getAnalysisHistory()
//         .then(setAnalyses)
//         .catch(console.error)
//         .finally(() => setIsLoading(false));
//     }
//   }, [isVisible]);

//   return (
//     <Modal visible={isVisible} transparent={true} animationType="fade">
//       <ModalBackdrop onClose={onClose} />
//       <View style={styles.modalContainer}>
//         <View
//           style={[
//             styles.modalContent,
//             { backgroundColor: cardColor, maxHeight: "70%" },
//           ]}>
//           <ThemedText style={styles.modalTitle}>
//             Associar a uma Análise
//           </ThemedText>
//           {isLoading ? (
//             <ActivityIndicator />
//           ) : (
//             <FlatList
//               data={analyses}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.templateButton}
//                   onPress={() => onSelect(item)}>
//                   <FlaskConical size={24} color={textColor} />
//                   <ThemedText style={styles.templateTitle}>
//                     {item.analysisSetup.analysisName || `Análise #${item.id}`}
//                   </ThemedText>
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={
//                 <ThemedText style={{ textAlign: "center" }}>
//                   Nenhuma análise encontrada.
//                 </ThemedText>
//               }
//             />
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

export function CreateNoteFAB() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeValue("primary");

  const [isTemplateMenuVisible, setTemplateMenuVisible] = useState(false);
  const [isAnalysisSelectorVisible, setAnalysisSelectorVisible] =
    useState(false);

  const handleSelectTemplate = (template: string) => {
    setTemplateMenuVisible(false);
    if (template === "analysis") {
      setTimeout(() => setAnalysisSelectorVisible(true), 150);
    } else {
      router.push(`/notes/new?template=${template}`);
    }
  };

  // const handleAnalysisSelected = (analysis: SavedAnalysis) => {
  //   setAnalysisSelectorVisible(false);
  //   router.push(
  //     `/notes/new?template=analysis&analysisId=${
  //       analysis.id
  //     }&analysisName=${encodeURIComponent(analysis.analysisSetup.analysisName)}`
  //   );
  // };

  return (
    <>
      <TemplateMenuModal
        isVisible={isTemplateMenuVisible}
        onClose={() => setTemplateMenuVisible(false)}
        onSelect={handleSelectTemplate}
      />
      {/* <AnalysisSelectorModal
        isVisible={isAnalysisSelectorVisible}
        onClose={() => setAnalysisSelectorVisible(false)}
        onSelect={handleAnalysisSelected}
      /> */}

      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: insets.bottom + Spacing.md, backgroundColor: primaryColor },
        ]}
        onPress={() => setTemplateMenuVisible(true)}>
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: Spacing.md,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Padding.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: Padding.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: "center",
    marginBottom: Margin.sm,
  },
  templateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
  },
  templateTitle: {
    marginLeft: Margin.md,
    fontSize: FontSize.lg,
  },
});
