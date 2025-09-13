import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { GlossaryItem } from "@/data/glossaryData";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface GlossaryListItemProps {
  item: GlossaryItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export function GlossaryListItem({
  item,
  isExpanded,
  onToggle,
}: GlossaryListItemProps) {
  const cardBg = useThemeValue("card");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <TouchableOpacity
        style={styles.termContainer}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}>
        <ThemedText style={[styles.term, { color: textColor }]}>
          {item.term}
        </ThemedText>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={22}
          color={textSecondary}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.definitionContainer}>
          <ThemedText style={[styles.definition, { color: textSecondary }]}>
            {item.definition}
          </ThemedText>
          <View
            style={[
              styles.themeBadge,
              { backgroundColor: `${accentColor}1A` },
            ]}>
            <ThemedText style={[styles.themeBadgeText, { color: accentColor }]}>
              {item.theme}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Margin.sm,
    padding: Padding.md,
    overflow: "hidden",
  },
  termContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  term: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    flex: 1,
  },
  definitionContainer: {
    marginTop: Margin.sm,
  },
  definition: {
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
  themeBadge: {
    alignSelf: "flex-start",
    marginTop: Margin.sm,
    paddingVertical: Padding.xs,
    paddingHorizontal: Padding.sm,
    borderRadius: BorderRadius.full,
  },
  themeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
