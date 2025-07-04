import IconButton from "@/components/ui/IconButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, Margin } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HomeHeaderProps {
  userName: string | null;
  onSettingsPress: () => void;
}

export function HomeHeader({ userName, onSettingsPress }: HomeHeaderProps) {
  const iconColor = useThemeValue("text");
  return (
    <View style={styles.header}>
      <ThemedText style={styles.greeting}>
        Olá, {userName || "Usuário"}!
      </ThemedText>
      <IconButton
        onPress={onSettingsPress}
        iconElement={
          <Ionicons name="settings-outline" size={24} color={iconColor} />
        }
        iconOnly={true}
        accessibilityLabel="botão de naveção para tela de configurações"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Margin.md,
  },
  greeting: {
    fontSize: FontSize.lg,
    alignItems: "center",
  },
});
