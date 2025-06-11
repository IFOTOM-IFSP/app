import { FormattedText } from "@/components/renderers/TextBlock";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const theme = Colors.light;

type Item = { label: string; content: string };
type ToggleExplanationProps = { title?: string; items: Item[] };

export const ToggleExplanation: React.FC<ToggleExplanationProps> = ({
  title,
  items,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.toggleContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.toggleButton,
              activeIndex === index && styles.activeButton,
            ]}
            onPress={() => setActiveIndex(index)}>
            <Text
              style={[
                styles.toggleText,
                activeIndex === index && styles.activeText,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>
        <FormattedText
          text={items[activeIndex]?.content || ""}
          style={styles.contentText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 1,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.accentPurple,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: theme.cardBackground,
  },
  activeButton: { backgroundColor: theme.accentPurple },
  toggleText: { fontSize: 16, color: theme.accentPurple, fontWeight: "600" },
  activeText: { color: theme.buttonText },
  contentContainer: {
    padding: 16,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  contentText: { fontSize: 16, lineHeight: 24, color: theme.textSecondary },
});
