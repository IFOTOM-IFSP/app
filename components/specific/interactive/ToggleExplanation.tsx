import { ThemedText } from "@/components/ui/ThemedText";
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
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Item = { label: string; content: string };
type ToggleExplanationProps = { title?: string; items: Item[] };

export function ToggleExplanation({ title, items }: ToggleExplanationProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const accentColor = useThemeValue("accentPurple");
  const cardBg = useThemeValue("cardBackground");
  const borderColor = useThemeValue("borderColor");
  const primaryText = useThemeValue("textPrimary");
  const buttonText = useThemeValue("buttonText");
  const secondaryText = useThemeValue("textSecondary");

  return (
    <View style={styles.container}>
      {title && (
        <ThemedText style={[styles.title, { color: primaryText }]}>
          {title}
        </ThemedText>
      )}
      <View style={[styles.toggleContainer, { borderColor: accentColor }]}>
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.toggleButton,
                { backgroundColor: isActive ? accentColor : "transparent" },
              ]}
              onPress={() => setActiveIndex(index)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}>
              <ThemedText
                style={[
                  styles.toggleText,
                  { color: isActive ? buttonText : accentColor },
                ]}>
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View
        style={[
          styles.contentContainer,
          { backgroundColor: cardBg, borderColor },
        ]}>
        <FormattedText
          text={items[activeIndex]?.content || ""}
          style={[styles.contentText, { color: secondaryText }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Margin.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 1,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Padding.md,
    alignItems: "center",
  },
  toggleText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
  },
  contentContainer: {
    padding: Padding.md,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  contentText: {
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
});
