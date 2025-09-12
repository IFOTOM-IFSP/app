import { IconButton } from "@/components/ui/icon/IconButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontWeight, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface AnalysisHeaderProps {
  handleMenuPress: () => void;
  name: string | null;
}
export default function AnalysisHeader({
  handleMenuPress,
  name,
}: AnalysisHeaderProps) {
  const textColor = useThemeValue("text");
  const accentColor = useThemeValue("tint");

  return (
    <View style={styles.header}>
      <View style={styles.headerOptions}>
        <IconButton
          iconName="menu"
          accessibilityLabel="menu de opções"
          iconLibrary="MaterialCommunityIcons"
          onPress={handleMenuPress}
          iconSize={30}
          iconColor={textColor}
        />
      </View>
      <ThemedText style={styles.welcome}>Olá, {name}!</ThemedText>
      <ThemedText style={styles.title}>
        Este é o <Text style={{ color: accentColor }}>iFOTOM Análises!</Text>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    width: "100%",
    paddingTop: Padding.xl,
    paddingHorizontal: Padding.lg,
    marginTop: Padding.lg,
    marginBottom: Padding.xl,
  },
  headerOptions: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: 40,
    marginBottom: Padding.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  welcome: { fontSize: 18, fontWeight: FontWeight.semiBold },
});
