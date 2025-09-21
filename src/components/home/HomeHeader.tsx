import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, FontWeight, Margin } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  userName: string | null;
  onSettingsPress: () => void;
}

export function HomeHeader({ userName, onSettingsPress }: HomeHeaderProps) {
  const iconColor = useThemeValue("text");
  const textSecond = useThemeValue("textSecondary");

  return (
    <View style={styles.header}>
      <View>
        <ThemedText style={styles.greeting}>
          Olá, {userName || "Usuário"}!
        </ThemedText>
        <ThemedText style={[styles.subGreeting, { color: textSecond }]}>
          Como você está hoje?
        </ThemedText>
      </View>
      <TouchableOpacity
        onPress={onSettingsPress}
        accessibilityLabel="Ir para as configurações">
        <Ionicons name="settings-outline" size={24} color={iconColor} />
      </TouchableOpacity>
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
  subGreeting: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.light,
  },
});
