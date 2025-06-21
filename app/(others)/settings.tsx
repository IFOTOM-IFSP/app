import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OptionButton } from "@/components/common/OptionButton";
import { SettingsSwitch } from "@/components/common/SettingsSwitch";
import BackButton from "@/components/ui/BackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { FontSize, FontWeight, Margin, Padding } from "@/constants/Styles";
import { useTheme } from "@/context/ThemeContext";
import { useUserStore } from "@/context/userStore";
import { useThemeValue } from "@/hooks/useThemeValue";
import { openEmail } from "@/utils/linkingUtils";
import { getSchemeLabel } from "@/utils/themeUtils";

export default function GeneralSettingsScreen() {
  const router = useRouter();
  const { scheme, setScheme } = useTheme();
  const userActions = useUserStore((state) => state.actions);

  const [isKeepScreenOn, setIsKeepScreenOn] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);

  const handleThemeChange = () => {
    Alert.alert(
      "Alterar Tema",
      "Escolha a aparência do aplicativo.",
      [
        { text: "Claro", onPress: () => setScheme("light") },
        { text: "Escuro", onPress: () => setScheme("dark") },
        { text: "Padrão do Sistema", onPress: () => setScheme("system") },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleChangeName = () => {
    Alert.alert("Trocar de nome", "Tem certeza que deseja trocar seu nome?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          await userActions.resetName();
          router.replace("./(auth)/enter-name");
        },
      },
    ]);
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Deletar Dados",
      "Esta ação é irreversível e irá apagar todos os seus dados. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            await userActions.deleteAllData();
            router.replace("/welcome");
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <BackButton title="Configurações" />

        <ThemedText style={[styles.sectionTitle]}>Aparência</ThemedText>
        <OptionButton
          label="Tema do Aplicativo"
          onPress={handleThemeChange}
          icon={<Feather name="sun" size={20} color={useThemeValue("icon")} />}
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
              color={useThemeValue("accentPurple")}
            />
          }
          info="Impede que a tela do seu dispositivo se apague automaticamente. Útil durante medições."
        />
        <SettingsSwitch
          label="Notificações"
          isEnabled={areNotificationsEnabled}
          onToggleSwitch={setAreNotificationsEnabled}
          icon={
            <Feather
              name="bell"
              size={20}
              color={useThemeValue("accentPurple")}
            />
          }
          info="Receba alertas sobre o término de medições ou lembretes para calibração."
        />

        <ThemedText style={styles.sectionTitle}>Conta</ThemedText>
        <OptionButton
          label="Trocar de nome"
          onPress={handleChangeName}
          icon={
            <Feather
              name="edit-2"
              size={20}
              color={useThemeValue("accentPurple")}
            />
          }
          info="Altere o nome de usuário associado a este dispositivo."
        />
        <OptionButton
          label="Deletar dados da conta"
          onPress={handleDeleteData}
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
              color={useThemeValue("accentPurple")}
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
              color={useThemeValue("accentPurple")}
            />
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Padding.md, paddingTop: Padding.md },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    marginTop: Margin.lg,
    marginBottom: Margin.sm,
    textTransform: "uppercase",
  },
});
