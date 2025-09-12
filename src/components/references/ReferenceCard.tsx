import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import {
  ArticleReference,
  BookReference,
  DissertationReference,
  OnlineMediaReference as GenericOnlineReference,
  Reference,
  WebsiteReference,
} from "@/models";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

interface ReferenceCardProps {
  reference: Reference;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({ reference }) => {
  const cardBg = useThemeValue("card");
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");

  const handlePressLink = (url: string | undefined) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", url, err)
      );
    }
  };

  const renderReferenceContent = () => {
    switch (reference.type) {
      case "artigo":
        const article = reference as ArticleReference;
        return (
          <View>
            <ThemedText style={styles.authors}>{article.authors}</ThemedText>
            <ThemedText style={styles.title}>{article.title}</ThemedText>
            <ThemedText style={styles.journal}>
              {article.journal}, v. {article.volume || "-"}, n.{" "}
              {article.number || "-"}, p. {article.pages || "-"}, {article.year}
              .
            </ThemedText>
            {article.doi && (
              <ThemedText style={styles.detailText}>
                DOI: {article.doi}
              </ThemedText>
            )}
            {article.url && (
              <TouchableOpacity
                onPress={() => handlePressLink(article.url)}
                style={styles.linkContainer}>
                <Feather
                  name="external-link"
                  size={FontSize.sm}
                  color={accentColor}
                />
                <ThemedText style={[styles.linkText, { color: accentColor }]}>
                  {" "}
                  Disponível aqui
                </ThemedText>
              </TouchableOpacity>
            )}
            <ThemedText style={styles.accessDate}>
              Acesso em: {article.accessDate}.
            </ThemedText>
          </View>
        );
      case "livro":
        const book = reference as BookReference;
        return (
          <View>
            <ThemedText style={styles.authors}>{book.authors}</ThemedText>
            <ThemedText style={styles.title}>{book.title}.</ThemedText>
            <ThemedText style={styles.journal}>
              {book.city}: {book.publisher}, {book.year}. {book.pages}.
            </ThemedText>
            {book.url && (
              <TouchableOpacity
                onPress={() => handlePressLink(book.url)}
                style={styles.linkContainer}>
                <Feather
                  name="external-link"
                  size={FontSize.sm}
                  color={accentColor}
                />
                <ThemedText style={[styles.linkText, { color: accentColor }]}>
                  {" "}
                  Disponível aqui
                </ThemedText>
              </TouchableOpacity>
            )}
            {book.accessDate && (
              <ThemedText style={styles.accessDate}>
                Acesso em: {book.accessDate}.
              </ThemedText>
            )}
          </View>
        );
      case "dissertacao":
        const dissertation = reference as DissertationReference;
        return (
          <View>
            <ThemedText style={styles.authors}>
              {dissertation.authors}
            </ThemedText>
            <ThemedText style={styles.title}>{dissertation.title}.</ThemedText>
            <ThemedText style={styles.journal}>
              {dissertation.year}. {dissertation.pages}. {dissertation.degree} –{" "}
              {dissertation.university}, {dissertation.city}.
            </ThemedText>
            {dissertation.url && (
              <TouchableOpacity
                onPress={() => handlePressLink(dissertation.url)}
                style={styles.linkContainer}>
                <Feather
                  name="external-link"
                  size={FontSize.sm}
                  color={accentColor}
                />
                <ThemedText style={[styles.linkText, { color: accentColor }]}>
                  {" "}
                  Disponível aqui
                </ThemedText>
              </TouchableOpacity>
            )}
            {dissertation.accessDate && (
              <ThemedText style={styles.accessDate}>
                Acesso em: {dissertation.accessDate}.
              </ThemedText>
            )}
          </View>
        );
      case "site":
        const site = reference as WebsiteReference;
        return (
          <View>
            <ThemedText style={styles.authors}>
              {site.authors || site.organization}.
            </ThemedText>
            <ThemedText style={styles.title}>{site.title}.</ThemedText>
            <TouchableOpacity
              onPress={() => handlePressLink(site.url)}
              style={styles.linkContainer}>
              <Feather
                name="external-link"
                size={FontSize.sm}
                color={accentColor}
              />
              <ThemedText style={[styles.linkText, { color: accentColor }]}>
                {" "}
                Disponível em: {site.url}
              </ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.accessDate}>
              Acesso em: {site.accessDate}.
            </ThemedText>
          </View>
        );
      case "video":
      case "slide":
        const genericOnline = reference as GenericOnlineReference;
        return (
          <View>
            <ThemedText style={styles.authors}>
              {genericOnline.authors ||
                genericOnline.type.charAt(0).toUpperCase() +
                  genericOnline.type.slice(1)}
              .
            </ThemedText>
            <ThemedText style={styles.title}>{genericOnline.title}.</ThemedText>
            <TouchableOpacity
              onPress={() => handlePressLink(genericOnline.url)}
              style={styles.linkContainer}>
              <Feather
                name="external-link"
                size={FontSize.sm}
                color={accentColor}
              />
              <ThemedText style={[styles.linkText, { color: accentColor }]}>
                {" "}
                Disponível em: {genericOnline.url}
              </ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.accessDate}>
              Acesso em: {genericOnline.accessDate}.
            </ThemedText>
          </View>
        );
      default:
        return (
          <ThemedText style={{ color: textColor }}>
            Tipo de referência desconhecido.
          </ThemedText>
        );
    }
  };

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.typeBadge}>
        <ThemedText style={[styles.typeText, { color: textColor }]}>
          {reference.type.charAt(0).toUpperCase() + reference.type.slice(1)}
        </ThemedText>
      </View>
      {renderReferenceContent()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    padding: Padding.md,
    marginBottom: Margin.md,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    overflow: "hidden",
  },
  typeBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    paddingHorizontal: Padding.sm,
    paddingVertical: Padding.xs,
    borderBottomLeftRadius: BorderRadius.md,
    zIndex: 1,
  },
  typeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  authors: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.xs,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.xs,
  },
  journal: {
    fontSize: FontSize.sm,
    marginBottom: Margin.xs,
    color: "gray", // Cor mais suave para detalhes
  },
  detailText: {
    fontSize: FontSize.sm,
    marginBottom: Margin.xs,
    color: "gray",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Margin.xs,
  },
  linkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    textDecorationLine: "underline",
    marginLeft: Margin.xs / 2,
  },
  accessDate: {
    fontSize: FontSize.xs,
    color: "gray",
    fontStyle: "italic",
    marginTop: Margin.xs,
  },
});

export default ReferenceCard;
