import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { BlurView } from "expo-blur";
import { FlaskConical, ListChecks, Notebook } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";
const templates = [
  {
    key: "quick",
    title: "Nota Rápida",
    subtitle: "Apenas texto, sem formatação.",
    icon: Notebook,
  },
  {
    key: "task",
    title: "Lista de Tarefas",
    subtitle: "Organize seus afazeres.",
    icon: ListChecks,
  },
  {
    key: "analysis",
    title: "Anotação de Análise",
    subtitle: "Vincule a um experimento.",
    icon: FlaskConical,
  },
];

export default function TemplateMenuModal({
  isVisible,
  onClose,
  onSelect,
}: any) {
  const cardColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const primaryColor = useThemeValue("primary");

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>

      <View style={styles.modalContainer} pointerEvents="box-none">
        <AnimatePresence>
          {isVisible && (
            <MotiView
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 50 }}
              style={[styles.modalContent, { backgroundColor: cardColor }]}>
              <ThemedText style={styles.modalTitle}>
                Criar Nova Anotação
              </ThemedText>
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <TouchableOpacity
                    key={template.key}
                    style={styles.templateButton}
                    onPress={() => onSelect(template.key)}>
                    <View
                      style={[
                        styles.iconWrapper,
                        { backgroundColor: primaryColor + "20" }, // Fundo com transparência
                      ]}>
                      <Icon size={24} color={primaryColor} />
                    </View>
                    <View>
                      <ThemedText style={styles.templateTitle}>
                        {template.title}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.templateSubtitle,
                          { color: textSecondary },
                        ]}>
                        {template.subtitle}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    gap: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: "center",
    marginBottom: Margin.md,
  },
  templateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
  },
  iconWrapper: {
    padding: Padding.sm,
    borderRadius: BorderRadius.md,
    marginRight: Margin.md,
  },
  templateTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  templateSubtitle: {
    fontSize: FontSize.md,
    marginTop: 2,
  },
});
