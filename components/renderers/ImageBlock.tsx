import { Colors } from "@/constants/Colors";
import { ImageContent } from "@/interfaces/content";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

export const ImageBlock: React.FC<{ block: ImageContent }> = ({ block }) => {
  return (
    <View style={styles.container}>
      <Image source={block.src} style={styles.image} resizeMode="contain" />
      {block.caption && <Text style={styles.caption}>{block.caption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  caption: {
    paddingTop: 8,
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: "center",
  },
});
