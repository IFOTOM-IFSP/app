import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { OptionButton } from "@/components/common/OptionButton";
import { SettingsSwitch } from "@/components/common/SettingsSwitch";
import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/constants/Styles";
import { useNotifications } from "@/hooks/useNotifications";
import { useThemeValue } from "@/hooks/useThemeValue";
import { useTheme } from "@/state/ThemeContext";
import { useUserStore } from "@/state/userStore";
import { openEmail } from "@/utils/linkingUtils";
import { getSchemeLabel } from "@/utils/themeUtils";
import * as KeepAwake from "expo-keep-awake";

export default function GeneralSettingsScreen() {
  const router = useRouter();
  const { scheme, setScheme } = useTheme();
  const userActions = useUserStore((state) => state.actions);

  const [isKeepScreenOn, setIsKeepScreenOn] = useState(false);
  const { notificationsEnabled, toggleNotifications } = useNotifications();
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
        style: "default",
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
    <ScreenLayout>
      <TitleSection
        title="Configurações Gerais"
        subtitle="Personalize a aparência e funcionalidades do aplicativo."
      />
      <OptionButton
        label="Tema do Aplicativo"
        onPress={handleThemeChange}
        icon={<Feather name="sun" size={20} color={useThemeValue("primary")} />}
        info="Altere a aparência do aplicativo entre o modo claro e escuro."
        value={getSchemeLabel(scheme)}
      />

      <ThemedText style={styles.sectionTitle}>Funcionalidades</ThemedText>
      <SettingsSwitch
        label="Manter a Tela Ativa"
        isEnabled={isKeepScreenOn}
        onToggleSwitch={setIsKeepScreenOn}
        icon={
          <Feather name="monitor" size={20} color={useThemeValue("primary")} />
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
        onPress={handleChangeName}
        icon={
          <Feather name="edit-2" size={20} color={useThemeValue("primary")} />
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
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Padding.md },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    marginTop: Margin.lg,
    marginBottom: Margin.sm,
    textTransform: "uppercase",
  },
});
