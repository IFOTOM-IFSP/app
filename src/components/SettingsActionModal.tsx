import { FontSize, FontWeight } from "@/src/constants/Styles";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  List,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

// Tipos para controlar qual modal estamos exibindo
type ModalType = "theme" | "changeName" | "deleteData";

interface SettingsActionModalProps {
  visible: boolean;
  modalType: ModalType | null;
  onDismiss: () => void;
  actions: {
    onSetScheme: (scheme: "light" | "dark" | "system") => void;
    onChangeName: () => void;
    onDeleteData: () => void;
  };
}

// Objeto de configuração para não poluir o JSX
const MODAL_CONFIG = {
  theme: {
    title: "Alterar Tema",
    description: "Escolha a aparência do aplicativo.",
  },
  changeName: {
    title: "Trocar de Nome",
    description:
      "Tem certeza que deseja trocar seu nome? Você será redirecionado para a tela de login.",
  },
  deleteData: {
    title: "Deletar Dados",
    description:
      "Esta ação é irreversível e irá apagar todos os seus dados. Deseja continuar?",
  },
};

export function SettingsActionModal({
  visible,
  modalType,
  onDismiss,
  actions,
}: SettingsActionModalProps) {
  const theme = useTheme();

  if (!modalType) return null;

  const config = MODAL_CONFIG[modalType];

  const renderContent = () => {
    if (modalType === "theme") {
      return (
        <View>
          <Text style={styles.description}>{config.description}</Text>
          <List.Item
            title="Claro"
            onPress={() => actions.onSetScheme("light")}
          />
          <List.Item
            title="Escuro"
            onPress={() => actions.onSetScheme("dark")}
          />
          <List.Item
            title="Padrão do Sistema"
            onPress={() => actions.onSetScheme("system")}
          />
        </View>
      );
    }
    return <Text style={styles.description}>{config.description}</Text>;
  };

  const renderActions = () => {
    if (modalType === "theme") {
      return <Button onPress={onDismiss}>Cancelar</Button>;
    }
    if (modalType === "changeName") {
      return (
        <>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button onPress={actions.onChangeName}>Sim</Button>
        </>
      );
    }
    if (modalType === "deleteData") {
      return (
        <>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button textColor={theme.colors.error} onPress={actions.onDeleteData}>
            Deletar
          </Button>
        </>
      );
    }
    return null;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Card style={{ borderRadius: 4 }}>
          <Card.Title title={config.title} titleStyle={styles.title} />
          <Card.Content>{renderContent()}</Card.Content>
          <Card.Actions>{renderActions()}</Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 5,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
