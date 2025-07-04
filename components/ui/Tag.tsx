import { BorderRadius, FontSize, Padding } from "@/constants/Styles";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface TagProps {
  icon?: React.ReactNode;
  text: string;
  backgroundColor: string;
  textColor: string;
}

export function Tag({ icon, text, backgroundColor, textColor }: TagProps) {
  return (
    <View style={[styles.tag, { backgroundColor }]}>
      {icon}
      <ThemedText style={[styles.tagText, { color: textColor }]}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Padding.xs,
    paddingHorizontal: Padding.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  tagText: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
});
