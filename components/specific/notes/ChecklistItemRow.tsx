import { FontSize, Padding, Spacing } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { CheckCircle, Circle, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}
interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onChangeText: (id: string, text: string) => void;
  onDeleteItem: (id: string) => void;
}

export function ChecklistItemRow({
  item,
  onToggle,
  onChangeText,
  onDeleteItem,
}: ChecklistItemRowProps) {
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");

  return (
    <View style={styles.checklistItem}>
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        {item.isChecked ? (
          <CheckCircle size={24} color={accentColor} />
        ) : (
          <Circle size={24} color={textSecondary} />
        )}
      </TouchableOpacity>
      <TextInput
        style={[
          styles.checklistInput,
          {
            color: item.isChecked ? textSecondary : textColor,
            textDecorationLine: item.isChecked ? "line-through" : "none",
          },
        ]}
        value={item.text}
        onChangeText={(text) => onChangeText(item.id, text)}
        placeholder="Nova tarefa"
        placeholderTextColor={textSecondary}
      />
      <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
        <Trash2 size={20} color={textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Padding.sm,
  },
  checklistInput: { flex: 1, fontSize: FontSize.lg },
});
