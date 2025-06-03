import IconButton from "@/components/ui/IconButton";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HomeHeaderProps {
  userName: string | null;
  onSettingsPress: () => void;
}

export function HomeHeader({ userName, onSettingsPress }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Olá, {userName || "Usuário"}!</Text>
      <IconButton
        onPress={onSettingsPress}
        iconElement={
          <Ionicons
            name="settings-outline"
            size={20}
            color={Colors.light.textPrimary}
          />
        }
        labelText=""
        style={styles.settingsButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    width: "100%",
    paddingBottom: 20,
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 18,
    color: Colors.light.textPrimary,
  },
  settingsButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingVertical: 0,
    paddingHorizontal: 0,
    minWidth: 60,
    minHeight: 0,
    marginRight: 0,
  },
});
