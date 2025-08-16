import { IconButton } from "@/components/ui/icon/IconButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
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
        iconName="settings-outline"
        iconLibrary="Ionicons"
        iconSize={24}
        iconColor={iconColor}
        accessibilityLabel="Ir para as configurações"
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
    fontWeight: FontWeight.medium,
  },
});
