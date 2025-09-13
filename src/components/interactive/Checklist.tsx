import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { FormattedText } from "@/utils/text-formatting";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ChecklistProps = {
  title?: string;
  items: string[];
};

export function Checklist({ title, items }: ChecklistProps) {
  const cardBg = useThemeValue("card");
  const borderColor = useThemeValue("border");
  const primaryText = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");

  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (index: number) => {
    setCheckedState((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      {title && (
        <ThemedText style={[styles.title, { color: primaryText }]}>
          {title}
        </ThemedText>
      )}
      {items.map((item, index) => {
        const isChecked = !!checkedState[index];
        return (
          <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => toggleCheck(index)}
            activeOpacity={0.6}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
            accessibilityLabel={item}>
            <AntDesign
              name={isChecked ? "checksquare" : "checksquareo"}
              size={24}
              color={isChecked ? accentColor : secondaryText}
              style={styles.icon}
            />
            <View style={styles.textWrapper}>
              <FormattedText
                text={item}
                style={[
                  styles.itemText,
                  { color: isChecked ? secondaryText : primaryText },
                  isChecked && styles.checkedText,
                ]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Padding.xl,
    marginVertical: Margin.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.xl,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Margin.md,
  },
  icon: {
    marginRight: Margin.md,
    marginTop: Spacing.xs,
  },
  textWrapper: {
    flex: 1,
  },
  itemText: {
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
  checkedText: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
});

export default Checklist;
