import { ThemedText } from "@/src/components/ui/ThemedText";
import { FontSize, Margin, Padding, Spacing } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { ListContent } from "@/src/models";
import { FormattedText } from "@/src/utils/text-formatting";
import { StyleSheet, View } from "react-native";

interface ListBlockProps {
  block: ListContent;
}

export function ListBlock({ block }: ListBlockProps) {
  const accentColor = useThemeValue("primary");
  const textColor = useThemeValue("text");

  return (
    <View style={styles.listContainer}>
      {block.items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <ThemedText style={[styles.bulletPoint, { color: accentColor }]}>
            •
          </ThemedText>
          <View style={{ flex: 1 }}>
            <FormattedText
              text={item.trim()}
              style={[styles.listItemText, { color: textColor }]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
