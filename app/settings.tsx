import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";

type OptionButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: "default" | "danger";
  info?: string;
};

const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  onPress,
  icon,
  style = "default",
  info,
}) => {
  const buttonStyle = style === "danger" ? styles.dangerButton : {};
  const textStyle = style === "danger" ? styles.dangerButtonText : {};

  return (
    <TouchableOpacity
      style={[styles.optionContainer, buttonStyle]}
      onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {icon}
        <Text
          style={[
            styles.optionText,
            textStyle,
            icon ? styles.textWithIcon : null,
          ]}>
          {label}
        </Text>
      </View>
      {info && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={(e) => {
            e.stopPropagation();
            Alert.alert(label, info);
          }}>
          <Feather name="help-circle" size={22} color="#ADB5BD" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

type SettingsSwitchProps = {
  label: string;
  icon?: React.ReactNode;
  isEnabled: boolean;
  onToggleSwitch: (value: boolean) => void;
  info?: string;
};

const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
  label,
  icon,
  isEnabled,
  onToggleSwitch,
  info,
}) => {
  return (
    <View style={styles.optionContainer}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {icon}
        <Text style={[styles.optionText, icon ? styles.textWithIcon : null]}>
          {label}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {info && (
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => Alert.alert(label, info)}>
            <Feather name="help-circle" size={22} color="#ADB5BD" />
          </TouchableOpacity>
        )}
        <Switch
          trackColor={{ false: "#E9E9EA", true: "#C1B2F3" }}
          thumbColor={isEnabled ? Colors.light.accentPurple : "#f4f3f4"}
          onValueChange={onToggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

export default function GeneralSettingsScreen() {
  const router = useRouter();
  const [isKeepScreenOn, setIsKeepScreenOn] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);

  const handleContact = async (
    emailAddress: string,
    subject: string = "",
    body: string = ""
  ) => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    let url = `mailto:${emailAddress}`;

    if (encodedSubject || encodedBody) {
      url += `?subject=${encodedSubject}&body=${encodedBody}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(
          `Não foi possível abrir o aplicativo de e-mail. URL: ${url}`
        );
        alert(
          "Não foi possível abrir o aplicativo de e-mail. Por favor, verifique se você tem um configurado."
        );
      }
    } catch (error) {
      console.error("Erro ao tentar abrir o e-mail:", error);
      alert("Ocorreu um erro ao tentar abrir o e-mail.");
    }
  };

  const handleChangeName = async () => {
    Alert.alert("Trocar de nome", "Tem certeza que deseja trocar seu nome?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          await AsyncStorage.removeItem("userName");
          router.replace("/(auth)/enter-name");
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
          onPress: () => console.log("Lógica para deletar dados..."),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton title="Configurações" />

      <Text style={styles.sectionTitle}>Aparência</Text>
      <OptionButton
        label="Tema do Aplicativo"
        onPress={() =>
          Alert.alert(
            "Mudar Tema",
            "Funcionalidade de troca de tema a ser implementada."
          )
        }
        icon={
          <Feather name="sun" size={20} color={Colors.light.accentPurple} />
        }
        info="Altere a aparência do aplicativo entre o modo claro e escuro."
      />

      <Text style={styles.sectionTitle}>Funcionalidades</Text>
      <SettingsSwitch
        label="Manter a Tela Ativa"
        isEnabled={isKeepScreenOn}
        onToggleSwitch={setIsKeepScreenOn}
        icon={
          <Feather name="monitor" size={20} color={Colors.light.accentPurple} />
        }
        info="Impede que a tela do seu dispositivo se apague automaticamente. Útil durante medições."
      />
      <SettingsSwitch
        label="Notificações"
        isEnabled={areNotificationsEnabled}
        onToggleSwitch={setAreNotificationsEnabled}
        icon={
          <Feather name="bell" size={20} color={Colors.light.accentPurple} />
        }
        info="Receba alertas sobre o término de medições ou lembretes para calibração."
      />

      <Text style={styles.sectionTitle}>Conta</Text>
      <OptionButton
        label="Trocar de nome"
        onPress={handleChangeName}
        icon={
          <Feather name="edit-2" size={20} color={Colors.light.accentPurple} />
        }
        info="Altere o nome de usuário associado a este dispositivo."
      />
      <OptionButton
        label="Deletar dados da conta"
        onPress={handleDeleteData}
        style="danger"
        icon={<Feather name="trash-2" size={20} color="#D93A3A" />}
      />

      <Text style={styles.sectionTitle}>Sobre</Text>
      <OptionButton
        label="Versão do App"
        onPress={() => Alert.alert("Versão do App", "v1.0.0")}
        icon={
          <Feather name="info" size={20} color={Colors.light.accentPurple} />
        }
      />
      <OptionButton
        label="Fale Conosco / Reportar Bug"
        onPress={() =>
          handleContact(
            "lucas.biazon@aluno.ifsp.edu.br",
            "Dúvida sobre o aplicativo",
            "Olá, tenho uma dúvida sobre..."
          )
        }
        icon={
          <Feather name="mail" size={20} color={Colors.light.accentPurple} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C757D",
    marginTop: 24,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  optionContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    height: 60,
  },
  optionText: {
    fontSize: 17,
    color: "#343A40",
  },
  textWithIcon: {
    marginLeft: 15,
  },
  infoButton: {
    paddingLeft: 10,
    marginRight: 5,
  },
  dangerButton: {
    backgroundColor: "#FFE0E0",
  },
  dangerButtonText: {
    color: "#D93A3A",
  },
});
