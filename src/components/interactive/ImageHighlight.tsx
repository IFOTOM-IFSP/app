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
import { ImageContent } from "@/src/models";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  DimensionValue,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Highlight = {
  label: string;
  description: string;
  x: DimensionValue;
  y: DimensionValue;
};
const DOT_SIZE = 18;
const TOUCHABLE_AREA_SIZE = 30;

type ImageHighlightProps = {
  title?: string;
  src: ImageContent["src"];
  highlights: Highlight[];
};

export function ImageHighlight({
  title,
  src,
  highlights,
}: ImageHighlightProps) {
  const [imageError, setImageError] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(
    highlights[0] || null
  );
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const cardBg = useThemeValue("card");
  const borderColor = useThemeValue("border");
  const shadow = useThemeValue("shadow");
  const primaryText = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");
  const accentColor = useThemeValue("primary");
  const buttonText = useThemeValue("buttonText");
  const dotBg = useThemeValue("pinkBackground");
  const explanationBg = useThemeValue("card");
  const placeholderGradient = useThemeValue("authGradient");
  useEffect(() => {
    setImageError(false);
  }, [src]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const showFallback = !src || imageError;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cardBg, borderColor, shadowColor: shadow },
      ]}>
      {title && (
        <ThemedText style={[styles.title, { color: primaryText }]}>
          {title}
        </ThemedText>
      )}

      <View style={styles.imageContainer}>
        {showFallback ? (
          <LinearGradient colors={placeholderGradient} style={styles.image} />
        ) : (
          <ImageBackground
            source={src}
            style={styles.image}
            contentFit="contain">
            {highlights.map((h, i) => {
              const isActive = activeHighlight?.label === h.label;
              const animatedStyle = isActive
                ? { transform: [{ scale: pulseAnim }] }
                : undefined;

              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.touchableArea, { top: h.y, left: h.x }]}
                  onPress={() => setActiveHighlight(h)}
                  activeOpacity={0.7}
                  accessibilityLabel={h.label}
                  accessibilityState={{ selected: isActive }}>
                  <Animated.View
                    style={[
                      styles.dot,
                      { backgroundColor: dotBg, borderColor: buttonText },
                      isActive && { backgroundColor: accentColor },
                      animatedStyle,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </ImageBackground>
        )}
      </View>

      <View style={[styles.explanationBox, { backgroundColor: explanationBg }]}>
        {activeHighlight ? (
          <>
            <ThemedText
              style={[styles.explanationLabel, { color: accentColor }]}>
              {activeHighlight.label}
            </ThemedText>
            <ThemedText
              style={[styles.explanationDescription, { color: secondaryText }]}>
              {activeHighlight.description}
            </ThemedText>
          </>
        ) : (
          <ThemedText
            style={[styles.explanationDescription, { color: secondaryText }]}>
            Toque em um ponto de destaque para ver a descrição.
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginVertical: Margin.md,
    padding: Padding.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  touchableArea: {
    position: "absolute",
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  explanationBox: {
    borderRadius: BorderRadius.md,
    padding: Padding.md,
    marginTop: Margin.md,
    minHeight: 100,
    justifyContent: "center",
  },
  explanationLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.xs,
  },
  explanationDescription: {
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
  },
});
