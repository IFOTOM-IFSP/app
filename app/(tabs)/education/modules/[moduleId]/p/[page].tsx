import { Colors } from "@/constants/Colors";
import {
  CodeContent,
  ContentBlock,
  ImageContent,
  InteractiveContent,
  TextContent,
  VideoContent,
} from "@/interfaces/content";
import {
  getModuleById,
  getModulePageById,
  getNextPage,
  getPreviousPage,
} from "@/utils/module-helpers";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";

const theme = Colors.light;

const renderBoldText = (text: string, style: StyleProp<TextStyle>) => {
  if (!text.includes("**")) {
    return <Text style={style}>{text}</Text>;
  }
  const parts = text.split("**");
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <Text key={index} style={{ fontWeight: "bold" }}>
        {part}
      </Text>
    ) : (
      <Text key={index} style={style}>
        {part}
      </Text>
    )
  );
};

type ContentBlockRendererProps = {
  block: ContentBlock;
};

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
}) => {
  switch (block.type) {
    case "text": {
      const textBlock = block as TextContent;
      if (textBlock.value.startsWith("$") && textBlock.value.endsWith("$")) {
        return (
          <View style={[styles.cardContainer, styles.latexContainer]}>
            <Text style={styles.latexText}>{textBlock.value}</Text>
          </View>
        );
      }
      if (textBlock.format === "list") {
        return (
          <View style={styles.listContainer}>
            {textBlock.value.split("\n- ").map(
              (item, index) =>
                item.trim() && (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listItemText}>
                      {renderBoldText(item.trim(), styles.listItemText)}
                    </Text>
                  </View>
                )
            )}
          </View>
        );
      }
      if (textBlock.format === "blockquote") {
        return (
          <View style={[styles.cardContainer, styles.blockquote]}>
            <Text style={styles.quoteIcon}>“</Text>
            <Text style={styles.blockquoteText}>{textBlock.value}</Text>
          </View>
        );
      }
      const styleMap = {
        heading1: styles.heading1,
        heading2: styles.heading2,
        paragraph: styles.paragraph,
      };
      const textStyle = styleMap[textBlock.format || "paragraph"];
      return renderBoldText(textBlock.value, textStyle);
    }

    case "image": {
      const imageBlock = block as ImageContent;
      return (
        <View style={[styles.cardContainer, styles.imageContainer]}>
          <Image
            source={imageBlock.src}
            style={styles.image}
            resizeMode="cover"
          />
          {imageBlock.caption && (
            <Text style={styles.caption}>{imageBlock.caption}</Text>
          )}
        </View>
      );
    }

    case "code": {
      const codeBlock = block as CodeContent;
      return (
        <View style={[styles.cardContainer, styles.codeContainer]}>
          <Text style={styles.codeLanguage}>{codeBlock.language}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.codeText}>{codeBlock.value}</Text>
          </ScrollView>
        </View>
      );
    }
    case "video": {
      const videoBlock = block as VideoContent;
      return (
        <View
          style={[
            styles.cardContainer,
            styles.placeholderContainer,
            styles.videoPlaceholder,
          ]}>
          <Text style={styles.placeholderIcon}>🎥</Text>
          <Text style={styles.placeholderTitle}>Vídeo: {videoBlock.alt}</Text>
          <Text style={styles.placeholderCaption}>Fonte: {videoBlock.src}</Text>
        </View>
      );
    }
    case "interactive": {
      const interactiveBlock = block as InteractiveContent;
      return (
        <View
          style={[
            styles.cardContainer,
            styles.placeholderContainer,
            styles.interactivePlaceholder,
          ]}>
          <Text style={styles.placeholderIcon}>🎮</Text>
          <Text style={styles.placeholderTitle}>Atividade Interativa</Text>
          <Text style={styles.placeholderCaption}>
            {interactiveBlock.componentName}
          </Text>
        </View>
      );
    }
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = block;
      return null;
  }
};

export default function ModuleContentPage() {
  const { moduleId, page: pageId } = useLocalSearchParams<{
    moduleId: string;
    page: string;
  }>();

  const module = getModuleById(moduleId);
  const pageContent = getModulePageById(moduleId, pageId);
  const nextPage = getNextPage(moduleId, pageId);
  const prevPage = getPreviousPage(moduleId, pageId);

  if (!module || !pageContent) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundIcon}>🚧</Text>
        <Text style={styles.heading1}>Conteúdo não encontrado!</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>{module.title}</Text>
      <Text style={styles.pageTitle}>{pageContent.title}</Text>

      {pageContent.content.map((block) => (
        <ContentBlockRenderer key={block.id} block={block} />
      ))}

      <View style={styles.navigationContainer}>
        {prevPage ? (
          <Link
            href={{
              pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
              params: { moduleId, page: prevPage.id },
            }}
            style={styles.navButtonSecondary}>
            <Text style={styles.navButtonTextSecondary}>← Anterior</Text>
          </Link>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {nextPage ? (
          <Link
            href={{
              pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
              params: { moduleId, page: nextPage.id },
            }}
            style={styles.navButtonPrimary}>
            <Text style={styles.navButtonTextPrimary}>Próxima →</Text>
          </Link>
        ) : (
          <Link
            href={`/(tabs)/education/modules/${moduleId}`}
            style={styles.navButtonPrimary}>
            <Text style={styles.navButtonTextPrimary}>Finalizar Módulo</Text>
          </Link>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // --- EFEITO DE SOMBRA REUTILIZÁVEL ---
  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
  },

  // --- CONTAINERS PRINCIPAIS ---
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 50,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    paddingTop: 24,
    marginHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor,
  },

  // --- TIPOGRAFIA ---
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 24,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 30, // Aumentado para melhor legibilidade
    color: theme.textPrimary,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  heading1: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  heading2: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.textPrimary,
    marginBottom: 12,
    marginTop: 24,
    paddingHorizontal: 24,
  },

  // --- ESTILO BASE PARA BLOCOS DE CONTEÚDO ---
  cardContainer: {
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },

  // --- BLOCOS DE CONTEÚDO ESPECÍFICOS ---
  blockquote: {
    padding: 24,
    paddingTop: 32,
    borderLeftWidth: 4,
    borderLeftColor: theme.tint,
  },
  blockquoteText: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.textSecondary,
    fontStyle: "italic",
    zIndex: 1,
  },
  quoteIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 100,
    color: theme.borderColor,
    opacity: 0.8,
    zIndex: 0,
  },
  listContainer: {
    marginBottom: 24,
    paddingHorizontal: 32, // Maior indentação para listas
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 18,
    lineHeight: 30,
    marginRight: 12,
    color: theme.tint,
  },
  listItemText: {
    fontSize: 18,
    lineHeight: 30,
    color: theme.textPrimary,
    flex: 1,
  },
  imageContainer: {},
  image: {
    width: "100%",
    height: 220,
    borderRadius: 15, // Pequeno ajuste para alinhar com a borda do container
  },
  caption: {
    padding: 16,
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: "center",
    backgroundColor: theme.cardBackground,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  codeContainer: {
    padding: 16,
    // Sombra já aplicada pelo cardContainer, mas o fundo escuro permanece
    backgroundColor: Colors.dark.cardBackground,
  },
  codeLanguage: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  codeText: {
    color: Colors.dark.text,
    fontFamily: "monospace",
    fontSize: 14,
  },
  latexContainer: {
    padding: 24,
    alignItems: "center",
  },
  latexText: {
    fontFamily: "monospace",
    fontSize: 18,
    color: theme.blue,
  },
  placeholderContainer: {
    padding: 24,
    alignItems: "center",
  },
  videoPlaceholder: {
    backgroundColor: theme.orangeBackground,
  },
  interactivePlaceholder: {
    backgroundColor: theme.greenBackground,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  placeholderTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.textPrimary,
  },
  placeholderCaption: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },

  // --- BOTÕES E OUTROS ---
  navButtonPrimary: {
    backgroundColor: theme.tint,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  navButtonTextPrimary: {
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  navButtonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  navButtonTextSecondary: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
});
