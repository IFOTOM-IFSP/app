import { FinanceHeader, HEADER_HEIGHT } from "@/src/components/common/Header";
import { OptionButton } from "@/src/components/common/OptionButton";
import { SettingsSwitch } from "@/src/components/common/SettingsSwitch";
import AlertModal from "@/src/components/ui/AlertModal";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/src/constants/Styles";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useTheme } from "@/src/store/ThemeContext";
import { useUserActions } from "@/src/store/userStore";
import { openEmail } from "@/src/utils/linkingUtils";
import { getSchemeLabel } from "@/src/utils/themeUtils";
import { Feather } from "@expo/vector-icons";
import * as KeepAwake from "expo-keep-awake";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type ModalType = "theme" | "changeName" | "deleteData" | null;

export default function GeneralSettingsScreen() {
  const router = useRouter();
  const { scheme, setScheme } = useTheme();
  const [isKeepScreenOn, setIsKeepScreenOn] = useState(false);
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const backgroundColor = useThemeValue("card");
  const contentBackgroundColor = useThemeValue("card");
  const actions = useUserActions();

  const isModalOpen = useSharedValue(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = useCallback(
    (type: ModalType) => {
      setModalType(type);
      isModalOpen.value = true;
    },
    [isModalOpen]
  );

  const closeModal = useCallback(() => {
    isModalOpen.value = false;
    setTimeout(() => {
      setModalType(null);
    }, 300);
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeepAwake = async () => {
      try {
        if (isKeepScreenOn) {
          await KeepAwake.activateKeepAwakeAsync();
        } else {
          await KeepAwake.deactivateKeepAwake();
        }
      } catch (e) {
        console.error("Falha ao controlar o KeepAwake", e);
      }
    };
    handleKeepAwake();

    return () => {
      KeepAwake.deactivateKeepAwake();
    };
  }, [isKeepScreenOn]);

  const performSetScheme = (newScheme: "light" | "dark" | "system") => {
    setScheme(newScheme);
    closeModal();
  };

  const performChangeName = async () => {
    try {
      await actions.resetUser();
      closeModal();
      router.replace("/(auth)/enter-name");
    } catch (error) {
      console.error("Erro ao resetar o usuário:", error);
      closeModal();
      Alert.alert("Erro", "Não foi possível trocar o nome. Tente novamente.");
    }
  };

  const performDeleteData = async () => {
    await actions.deleteAllData();
    closeModal();
    router.replace("/welcome");
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "theme":
        return (
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Escolha um Tema</ThemedText>
            <OptionButton
              label="Claro"
              onPress={() => performSetScheme("light")}
            />
            <OptionButton
              label="Escuro"
              onPress={() => performSetScheme("dark")}
            />
            <OptionButton
              label="Padrão do Sistema"
              onPress={() => performSetScheme("system")}
            />
          </View>
        );
      case "changeName":
        return (
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Trocar de Nome</ThemedText>
            <ThemedText style={styles.modalDescription}>
              Isso irá te redirecionar para a tela de entrada de nome. Tem
              certeza?
            </ThemedText>
            <OptionButton label="Confirmar" onPress={performChangeName} />
            <OptionButton
              label="Cancelar"
              onPress={closeModal}
              variant="danger"
            />
          </View>
        );
      case "deleteData":
        return (
          <View style={styles.modalContent}>
            <ThemedText
              style={[
                styles.modalTitle,
                { color: useThemeValue("dangerText") },
              ]}>
              Deletar Dados
            </ThemedText>
            <ThemedText style={styles.modalDescription}>
              Essa ação é irreversível e todos os seus dados serão apagados.
              Deseja continuar?
            </ThemedText>
            <OptionButton
              label="Sim, deletar tudo"
              onPress={performDeleteData}
              variant="danger"
            />
            <OptionButton label="Cancelar" onPress={closeModal} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <FinanceHeader title="Configurações" showBackButton={true} />
      <View
        style={[
          styles.contentCardContainer,
          { backgroundColor: contentBackgroundColor },
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <OptionButton
            label="Tema do Aplicativo"
            onPress={() => openModal("theme")}
            icon={
              <Feather name="sun" size={20} color={useThemeValue("primary")} />
            }
            info="Altere a aparência do aplicativo entre o modo claro e escuro."
            value={getSchemeLabel(scheme)}
          />

          <ThemedText style={styles.sectionTitle}>Funcionalidades</ThemedText>
          <SettingsSwitch
            label="Manter a Tela Ativa"
            isEnabled={isKeepScreenOn}
            onToggleSwitch={setIsKeepScreenOn}
            icon={
              <Feather
                name="monitor"
                size={20}
                color={useThemeValue("primary")}
              />
            }
            info="Impede que a tela do seu dispositivo se apague automaticamente. Útil durante medições."
          />
          <SettingsSwitch
            label="Notificações"
            isEnabled={notificationsEnabled}
            onToggleSwitch={toggleNotifications}
            icon={
              <Feather name="bell" size={20} color={useThemeValue("primary")} />
            }
            info="Receba um lembrete diário para realizar suas análises e estudos."
          />

          <ThemedText style={styles.sectionTitle}>Conta</ThemedText>
          <OptionButton
            label="Trocar de nome"
            onPress={() => openModal("changeName")}
            icon={
              <Feather
                name="edit-2"
                size={20}
                color={useThemeValue("primary")}
              />
            }
            info="Altere o nome de usuário associado a este dispositivo."
          />
          <OptionButton
            label="Deletar dados da conta"
            onPress={() => openModal("deleteData")}
            variant="danger"
            icon={
              <Feather
                name="trash-2"
                size={20}
                color={useThemeValue("dangerText")}
              />
            }
          />

          <ThemedText style={styles.sectionTitle}>Sobre</ThemedText>
          <OptionButton
            label="Versão do App"
            onPress={() => Alert.alert("Versão do App", "v1.0.0")}
            icon={
              <Feather name="info" size={20} color={useThemeValue("primary")} />
            }
          />
          <OptionButton
            label="Fale Conosco / Reportar Bug"
            onPress={() =>
              openEmail(
                "ifotom.ifsp@gmail.com",
                "Dúvida sobre o aplicativo",
                "Olá, tenho uma dúvida sobre..."
              )
            }
            icon={
              <Feather name="mail" size={20} color={useThemeValue("primary")} />
            }
          />
        </ScrollView>
      </View>

      <AlertModal isOpen={isModalOpen} toggleSheet={closeModal}>
        {renderModalContent()}
      </AlertModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentCardContainer: {
    position: "absolute",
    top: HEADER_HEIGHT - 90,
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    padding: Padding.lg,
    paddingTop: Padding.xl,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    marginTop: Margin.lg,
    marginBottom: Margin.sm,
    textTransform: "uppercase",
  },
  sheet: {
    // padding: 16,
    // width: "100%",
    // position: "absolute",
    // bottom: 0,
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    // zIndex: 2,
    // paddingBottom: 40,
  },
  modalContent: {
    gap: 10,
    padding: Padding.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: "center",
    marginBottom: Margin.md,
  },
  modalDescription: {
    textAlign: "center",
    marginBottom: Margin.lg,
  },
});
