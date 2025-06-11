import { Colors } from "@/constants/Colors";
import { VideoContent } from "@/interfaces/content";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const theme = Colors.light;
const { width } = Dimensions.get("window");
const videoWidth = width - 40;
const videoHeight = videoWidth * (9 / 16);

const getYouTubeId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const VideoBlock: React.FC<{ block: VideoContent }> = ({ block }) => {
  const videoId = getYouTubeId(block.src);

  if (!videoId) {
    return <Text>URL do vídeo do YouTube inválida.</Text>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <WebView
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: embedUrl }}
          allowsFullscreenVideo={true}
        />
      </View>
      {block.caption && <Text style={styles.caption}>{block.caption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  videoWrapper: {
    width: videoWidth,
    height: videoHeight,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  caption: {
    paddingTop: 8,
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: "center",
  },
});
