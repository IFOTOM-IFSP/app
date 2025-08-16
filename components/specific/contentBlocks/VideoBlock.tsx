import { ThemedText } from "@/components/ui/ThemedText";
import { BorderRadius, FontSize, Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { VideoContent } from "@/models";
import { getYouTubeId } from "@/utils/videoUtils";
import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export function VideoBlock({ block }: { block: VideoContent }) {
  const videoPlaceholderBg = useThemeValue("disabledBackground");
  const captionColor = useThemeValue("textSecondary");

  const videoId = getYouTubeId(block.src);

  if (!videoId) {
    return <ThemedText>URL do vídeo do YouTube inválida.</ThemedText>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <View style={styles.container}>
      <View
        style={[styles.videoWrapper, { backgroundColor: videoPlaceholderBg }]}>
        <WebView
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: embedUrl }}
          allowsFullscreenVideo={true}
        />
      </View>
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
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
  caption: {
    paddingTop: Padding.sm,
    fontSize: FontSize.sm,
    textAlign: "center",
  },
});
