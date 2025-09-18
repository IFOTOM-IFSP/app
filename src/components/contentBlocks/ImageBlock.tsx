import { ThemedText } from "@/src/components/ui/ThemedText";
import { BorderRadius, FontSize, Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { ImageContent } from "@/models";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

export function ImageBlock({ block }: { block: ImageContent }) {
  const captionColor = useThemeValue("textSecondary");

  return (
    <View style={styles.container}>
      <Image
        source={block.src}
        style={styles.image}
        contentFit="cover"
        transition={300}
        accessibilityLabel={block.alt}
      />
      {block.caption && (
        <ThemedText style={[styles.caption, { color: captionColor }]}>
          {block.caption}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Margin.lg,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: BorderRadius.lg,
  },
  caption: {
    paddingTop: Padding.sm,
    fontSize: FontSize.sm,
    textAlign: "center",
  },
});
