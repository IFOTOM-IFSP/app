import { FontSize, FontWeight, Margin, Padding } from "@/constants/Styles";
import { useNotifications } from "@/hooks/useNotifications";
import { useThemeValue } from "@/hooks/useThemeValue";
import { FinanceHeader, HEADER_HEIGHT } from "@/src/components/common/Header";
import { OptionButton } from "@/src/components/common/OptionButton";
import { SettingsSwitch } from "@/src/components/common/SettingsSwitch";
import { SettingsActionModal } from "@/src/components/SettingsActionModal";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useTheme } from "@/store/ThemeContext";
import { useUserActions } from "@/store/userStore";
import { openEmail } from "@/utils/linkingUtils";
import { getSchemeLabel } from "@/utils/themeUtils";
import { Feather } from "@expo/vector-icons";
import * as KeepAwake from "expo-keep-awake";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ModalState = {
  visible: boolean;
  type: "theme" | "changeName" | "deleteData" | null;
};

export default function GeneralSettingsScreen() {
  const router = useRouter();
  const { scheme, setScheme } = useTheme();
  const [isKeepScreenOn, setIsKeepScreenOn] = useState(false);
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const backgroundColor = useThemeValue("card");
  const contentBackgroundColor = useThemeValue("card");
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    type: null,
  });
  const actions = useUserActions();

  const openModal = (type: ModalState["type"]) =>
    setModalState({ visible: true, type });
  const closeModal = () => setModalState({ visible: false, type: null });
  useEffect(() => {
    if (isKeepScreenOn) {
      KeepAwake.activateKeepAwakeAsync();
    } else {
      KeepAwake.deactivateKeepAwake();
    }

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["bottom", "left", "right"]}>
      <Portal.Host>
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
                <Feather
                  name="sun"
                  size={20}
                  color={useThemeValue("primary")}
                />
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
                <Feather
                  name="bell"
                  size={20}
                  color={useThemeValue("primary")}
                />
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
                <Feather
                  name="info"
                  size={20}
                  color={useThemeValue("primary")}
                />
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
                <Feather
                  name="mail"
                  size={20}
                  color={useThemeValue("primary")}
                />
              }
            />
          </ScrollView>
        </View>
        <SettingsActionModal
          visible={modalState.visible}
          modalType={modalState.type}
          onDismiss={closeModal}
          actions={{
            onSetScheme: performSetScheme,
            onChangeName: performChangeName,
            onDeleteData: performDeleteData,
          }}
        />
      </Portal.Host>
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
});
