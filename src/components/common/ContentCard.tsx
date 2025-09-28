import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  metaInfo?: string;
  onPress?: () => void;
}

const CARD_IMAGE_HEIGHT = 180;
const CARD_CONTENT_PADDING = Padding.lg * 2;
const CARD_CONTENT_ESTIMATED_HEIGHT = 100;
export const CONTENT_CARD_HEIGHT =
  CARD_IMAGE_HEIGHT + CARD_CONTENT_PADDING + CARD_CONTENT_ESTIMATED_HEIGHT;

function ContentCard({
  id,
  title,
  description,
  thumbnailUrl,
  metaInfo,
  onPress,
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);

  const cardBg = useThemeValue("card");
  const shadowColor = useThemeValue("shadow");
  const borderColor = useThemeValue("border");
  const imagePlaceholder = useThemeValue("primary");
  const placeholderGradient = useThemeValue("authGradient");
  const textColor = useThemeValue("text");
  const textSecondaryColor = useThemeValue("textSecondary");

  useEffect(() => {
    setImageError(false);
  }, [thumbnailUrl]);

  const showGradient = !thumbnailUrl || imageError;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        { backgroundColor: cardBg, shadowColor, borderColor },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${description}`}>
      {showGradient ? (
        <LinearGradient
          colors={placeholderGradient}
          style={styles.gradientPlaceholder}
        />
      ) : (
        <Image
          source={thumbnailUrl}
          style={[styles.thumbnail, { backgroundColor: imagePlaceholder }]}
          contentFit="cover"
          accessibilityLabel={`Capa de ${title}`}
          onError={() => setImageError(true)}
          transition={300}
        />
      )}
      <View style={styles.contentWrapper}>
        {metaInfo && (
          <ThemedText style={[styles.metaInfo, { color: textSecondaryColor }]}>
            {metaInfo}
          </ThemedText>
        )}
        <ThemedText style={[styles.title, { color: textColor }]}>
          {title}
        </ThemedText>
        <ThemedText
          style={[styles.description, { color: textSecondaryColor }]}
          numberOfLines={2}>
          {description}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BorderRadius.lg,
    marginVertical: Margin.sm,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        borderWidth: 1,
      },
    }),
  },
  thumbnail: {
    width: "100%",

    height: CARD_IMAGE_HEIGHT,
  },
  gradientPlaceholder: {
    width: "100%",
    height: CARD_IMAGE_HEIGHT,
  },
  contentWrapper: {
    paddingVertical: Padding.lg,
    paddingHorizontal: Padding.xl,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.xs,
  },
  description: {
    fontSize: FontSize.sm,
    lineHeight: Spacing.xl,
  },
  metaInfo: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginBottom: Margin.sm,
  },
});

export default React.memo(ContentCard);
