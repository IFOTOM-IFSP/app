import { ThemedText } from "@/src/components/ui/ThemedText";
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
import { useRouter } from "expo-router";
import {
  FlaskConical,
  ListChecks,
  Notebook,
  Plus,
  X,
} from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

const TemplateMenuModal = ({ isVisible, onClose, onSelect }: any) => {
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
};

export function CreateNoteFAB() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeValue("primary");

  const [isTemplateMenuVisible, setTemplateMenuVisible] = useState(false);

  const handleSelectTemplate = (template: string) => {
    setTemplateMenuVisible(false);
    // Adiciona um pequeno delay para a animação do modal concluir
    setTimeout(() => {
      if (template === "analysis") {
        // Lógica para selecionar análise pode ser adicionada aqui depois
        router.push(`/notes/new?template=analysis`);
      } else {
        router.push(`/notes/new?template=${template}`);
      }
    }, 200);
  };

  return (
    <>
      <TemplateMenuModal
        isVisible={isTemplateMenuVisible}
        onClose={() => setTemplateMenuVisible(false)}
        onSelect={handleSelectTemplate}
      />

      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: insets.bottom + Spacing.md, backgroundColor: primaryColor },
        ]}
        onPress={() => setTemplateMenuVisible(true)}>
        <AnimatePresence>
          <MotiView
            key={isTemplateMenuVisible ? "close" : "add"}
            from={{ rotate: "-180deg", scale: 0 }}
            animate={{ rotate: "0deg", scale: 1 }}
            exit={{ rotate: "180deg", scale: 0 }}>
            {isTemplateMenuVisible ? (
              <X size={28} color="white" />
            ) : (
              <Plus size={28} color="white" />
            )}
          </MotiView>
        </AnimatePresence>
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
    bottom: -100,
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
