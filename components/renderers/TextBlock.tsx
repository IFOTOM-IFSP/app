// src/components/content/renderers/TextBlock.tsx

import { Colors } from "@/constants/Colors";
import { TextContent } from "@/interfaces/content";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

const theme = Colors.light;

// --- FUNÇÕES AUXILIARES ---

// Esta função converte os comandos de matemática simples para Unicode
function convertMathToUnicode(latex: string): string {
  let unicodeString = latex;

  // Mapeamento de comandos simples para seus símbolos
  const replacements = {
    "\\\\varepsilon": "ε",
    "\\\\cdot": "·",
    "\\\\log": "log",
    I_0: "I₀", // Subscrito 0
    "mol^{-1}": "mol⁻¹",
    "cm^{-1}": "cm⁻¹",
  };

  for (const [key, value] of Object.entries(replacements)) {
    unicodeString = unicodeString.replace(new RegExp(key, "g"), value);
  }

  // Remove qualquer tag \\text{} que possa ter sobrado
  unicodeString = unicodeString.replace(/\\text\{(.*?)\}/g, "$1");

  return unicodeString;
}

// Esta função agora usa o conversor Unicode
export const FormattedText: React.FC<{
  text: string;
  style: StyleProp<TextStyle>;
}> = ({ text, style }) => {
  // Divide a string por **negrito** ou por $matemática$
  const parts = text.split(/(\*\*.*?\*\*|\$.*?\$)/g);

  return (
    <Text style={style}>
      {parts.filter(Boolean).map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={index} style={{ fontWeight: "bold" }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith("$") && part.endsWith("$")) {
          // Pega o conteúdo da fórmula e converte para texto Unicode
          const formulaContent = part.slice(1, -1);
          return (
            <Text key={index}>{convertMathToUnicode(formulaContent)}</Text>
          );
        }
        return part;
      })}
    </Text>
  );
};

// --- O COMPONENTE PRINCIPAL ---

export const TextBlock: React.FC<{ block: TextContent }> = ({ block }) => {
  if (block.format === "blockquote") {
    return (
      <View style={styles.blockquote}>
        <FormattedText text={block.value} style={styles.blockquoteText} />
      </View>
    );
  }

  if (block.format === "list") {
    return (
      <View style={styles.listContainer}>
        {block.value
          .split("\n- ")
          .filter((item) => item.trim())
          .map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              {/* O container de texto para a lista precisa permitir que o texto quebre a linha */}
              <View style={{ flex: 1 }}>
                <FormattedText text={item.trim()} style={styles.listItemText} />
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
    note: styles.note,
  };

  return (
    <FormattedText
      text={block.value}
      style={styleMap[block.format || "paragraph"]}
    />
  );
};

// --- ESTILOS ---

const styles = StyleSheet.create({
  // Coloque aqui todos os seus estilos para paragraph, heading1, list, etc.
  paragraph: {
    fontSize: 17,
    lineHeight: 28,
    color: theme.textPrimary,
    marginBottom: 24,
    textAlign: "justify",
  },
  heading1: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 16,
    marginTop: 16,
  },
  heading2: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.textPrimary,
    marginBottom: 12,
    marginTop: 24,
  },
  blockquote: {
    padding: 16,
    paddingLeft: 20,
    backgroundColor: "rgba(107, 70, 193, 0.05)",
    borderLeftWidth: 4,
    borderLeftColor: theme.accentPurple,
    marginBottom: 24,
    borderRadius: 4,
  },
  blockquoteText: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.text,
    fontStyle: "italic",
  },
  listContainer: {
    marginBottom: 24,
    paddingLeft: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 17,
    lineHeight: 28,
    marginRight: 12,
    color: theme.accentPurple,
  },
  listItemText: {
    fontSize: 17,
    lineHeight: 28,
    color: theme.textPrimary,
    flex: 1, // Permite que o texto quebre a linha corretamente
    textAlign: "justify",
  },
  note: {
    backgroundColor: "rgba(255, 229, 100, 0.3)", // Fundo amarelo claro
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107", // Borda amarela
    color: "#5B4E1B",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
});
