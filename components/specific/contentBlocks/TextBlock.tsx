import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { TextContent } from "@/models"; // Verifique se o caminho para seus tipos está correto
import { FormattedText } from "@/utils/text-formatting";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TextBlockProps {
  block: TextContent;
}

/**
 * Renderiza blocos de conteúdo baseados em texto, como parágrafos,
 * títulos, citações e notas.
 */
export function TextBlock({ block }: TextBlockProps) {
  const textPrimaryColor = useThemeValue("text");
  const textSecondaryColor = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");
  const blockquoteBgColor = useThemeValue("card");
  const noteBgColor = useThemeValue("primaryBackground");
  const noteBorderColor = useThemeValue("border");

  // Lógica para 'blockquote' permanece a mesma
  if (block.format === "blockquote") {
    return (
      <View
        style={[
          styles.blockquote,
          {
            backgroundColor: blockquoteBgColor,
            borderLeftColor: accentColor,
          },
        ]}>
        <FormattedText
          text={block.value}
          style={[styles.blockquoteText, { color: textSecondaryColor }]}
        />
      </View>
    );
  }

  // Lógica para 'note'
  if (block.format === "note") {
    return (
      <View
        style={[
          styles.noteContainer,
          {
            backgroundColor: noteBgColor,
            borderLeftColor: noteBorderColor,
          },
        ]}>
        <FormattedText
          text={block.value}
          style={[styles.noteText, { color: textPrimaryColor }]}
        />
      </View>
    );
  }

  // Mapeamento para os formatos de texto restantes (headings, paragraph)
  const styleMap = {
    heading1: styles.heading1,
    heading2: styles.heading2,
    paragraph: styles.paragraph,
  };

  const textStyle = [
    styleMap[block.format || "paragraph"],
    { color: textPrimaryColor },
  ];

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
  noteContainer: {
    padding: Padding.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    marginBottom: Margin.lg,
  },
  noteText: {
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
});
