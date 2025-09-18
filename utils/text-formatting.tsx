import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontWeight } from "@/constants/Styles";
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

function convertMathToUnicode(latex: string): string {
  let unicodeString = latex;

  const replacements = {
    "\\\\varepsilon": "ε",
    "\\\\cdot": "·",
    "\\\\log": "log",
    I_0: "I₀",
    "mol^{-1}": "mol⁻¹",
    "cm^{-1}": "cm⁻¹",
  };

  for (const [key, value] of Object.entries(replacements)) {
    unicodeString = unicodeString.replace(new RegExp(key, "g"), value);
  }

  unicodeString = unicodeString.replace(/\\text\{(.*?)\}/g, "$1");

  return unicodeString;
}

interface FormattedTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
}

export function FormattedText({ text, style }: FormattedTextProps) {
  const parts = text.split(/(\*\*.*?\*\*|\$.*?\$)/g);

  return (
    <ThemedText style={style}>
      {parts.filter(Boolean).map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <ThemedText key={index} style={{ fontWeight: FontWeight.bold }}>
              {part.slice(2, -2)}
            </ThemedText>
          );
        }
        if (part.startsWith("$") && part.endsWith("$")) {
          const formulaContent = part.slice(1, -1);
          return (
            <Text key={index}>{convertMathToUnicode(formulaContent)}</Text>
          );
        }
        return part;
      })}
    </ThemedText>
  );
}
