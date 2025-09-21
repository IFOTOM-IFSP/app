import { BorderRadius, FontSize, Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { VideoContent } from "@/models";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { getYouTubeId } from "@/utils/videoUtils";
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

  // **INÍCIO DA CORREÇÃO**
  // Construa o HTML completo do iframe com a política de referenciador correta.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body, html, iframe {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            border: none;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <iframe
          src="${embedUrl}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin" 
        ></iframe>
      </body>
    </html>
  `;
  // **FIM DA CORREÇÃO**

  return (
    <View style={styles.container}>
      <View
        style={[styles.videoWrapper, { backgroundColor: videoPlaceholderBg }]}>
        <WebView
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ html: htmlContent }}
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
