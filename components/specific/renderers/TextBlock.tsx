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
import { TextContent } from "@/interfaces/content";
import { FormattedText } from "@/utils/text-formatting";
import React from "react";
import { StyleSheet, View } from "react-native";

export function TextBlock({ block }: { block: TextContent }) {
  const textPrimaryColor = useThemeValue("textPrimary");
  const textSecondaryColor = useThemeValue("text");
  const accentPurpleColor = useThemeValue("accentPurple");
  const blockquoteBgColor = useThemeValue("blockquoteBackground");
  const noteBgColor = useThemeValue("noteBackground");
  const noteBorderColor = useThemeValue("noteBorder");
  const noteTextColor = useThemeValue("noteText");

  if (block.format === "blockquote") {
    return (
      <View
        style={[
          styles.blockquote,
          {
            backgroundColor: blockquoteBgColor,
            borderLeftColor: accentPurpleColor,
          },
        ]}>
        <FormattedText
          text={block.value}
          style={[styles.blockquoteText, { color: textSecondaryColor }]}
        />
      </View>
    );
  }

  if (block.format === "list") {
    return (
      <View style={styles.listContainer}>
        {block.value
          .split("\n- ")
          .filter(Boolean)
          .map((item, index) => (
            <View key={index} style={styles.listItem}>
              <ThemedText
                style={[styles.bulletPoint, { color: accentPurpleColor }]}>
                •
              </ThemedText>
              <View style={{ flex: 1 }}>
                <FormattedText
                  text={item.trim()}
                  style={[styles.listItemText, { color: textPrimaryColor }]}
                />
              </View>
            </View>
          ))}
      </View>
    );
  }

  const styleMap = {
    heading1: styles.heading1,
    heading2: styles.heading2,
    paragraph: styles.paragraph,
    note: [
      styles.note,
      {
        backgroundColor: noteBgColor,
        borderLeftColor: noteBorderColor,
        color: noteTextColor,
      },
    ],
  };

  const textStyle =
    block.format === "note"
      ? styleMap.note
      : [styleMap[block.format || "paragraph"], { color: textPrimaryColor }];

  return <FormattedText text={block.value} style={textStyle} />;
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: FontSize.lg, 
    lineHeight: Spacing.xl, 
    marginBottom: Margin.lg, 
    textAlign: "justify",
  },
  heading1: {
    fontSize: FontSize.xxl, 
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md, 
    marginTop: Margin.md, 
  },
  heading2: {
    fontSize: FontSize.xl, 
    fontWeight: FontWeight.semiBold, 
    marginBottom: Margin.sm, 
    marginTop: Margin.lg, 
  },
  blockquote: {
    padding: Padding.md,
    paddingLeft: Padding.xl, 
    borderLeftWidth: 4,
    marginBottom: Margin.lg, 
    borderRadius: BorderRadius.sm, 
  },
  blockquoteText: {
    fontSize: FontSize.md, 
    lineHeight: Spacing.lg, 
    fontStyle: "italic",
  },
  listContainer: {
    marginBottom: Margin.lg, 
    paddingLeft: Padding.sm, 
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Margin.sm, 
  },
  bulletPoint: {
    fontSize: FontSize.lg, 
    lineHeight: Spacing.xl, 
    marginRight: Margin.sm, 
  },
  listItemText: {
    fontSize: FontSize.lg, 
    lineHeight: Spacing.xl, 
    flex: 1,
    textAlign: "justify",
  },
  note: {
    padding: Padding.md, 
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    fontSize: FontSize.md, 
    lineHeight: Spacing.lg, 
    marginBottom: Margin.lg, 
  },
});
