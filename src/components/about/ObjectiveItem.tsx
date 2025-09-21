import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, Margin, Spacing } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface ObjectiveItemProps {
  text: string;
}

export function ObjectiveItem({ text }: ObjectiveItemProps) {
  const tintColor = useThemeValue("primary");

  return (
    <View style={styles.objectiveItem}>
      <Ionicons
        name="checkmark-circle-outline"
        size={22}
        color={tintColor}
        style={styles.objectiveIcon}
      />
      <ThemedText style={styles.objectiveText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  objectiveItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Margin.md,
  },
  objectiveIcon: {
    marginRight: Margin.md,
  },
  objectiveText: {
    flex: 1,
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
});
