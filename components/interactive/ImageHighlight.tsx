import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  DimensionValue,
  Easing,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const theme = Colors.light;

type Highlight = {
  label: string;
  description: string;
  x: DimensionValue;
  y: DimensionValue;
};

type ImageHighlightProps = {
  title?: string;
  src: ImageSourcePropType;
  highlights: Highlight[];
};

const ImageHighlight: React.FC<ImageHighlightProps> = ({
  title,
  src,
  highlights,
}) => {
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(
    highlights[0] || null
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, [pulseAnim]);

  const animatedStyle = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.imageContainer}>
        <ImageBackground source={src} style={styles.image} resizeMode="contain">
          {highlights.map((h, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.touchableArea, { top: h.y, left: h.x }]}
              onPress={() => setActiveHighlight(h)}
              activeOpacity={0.7}>
              <Animated.View
                style={[
                  styles.dot,
                  activeHighlight?.label === h.label && styles.activeDot,
                  animatedStyle,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ImageBackground>
      </View>
      <View style={styles.explanationBox}>
        {activeHighlight ? (
          <>
            <Text style={styles.explanationLabel}>{activeHighlight.label}</Text>
            <Text style={styles.explanationDescription}>
              {activeHighlight.description}
            </Text>
          </>
        ) : (
          <Text style={styles.explanationDescription}>
            Toque em um ponto de destaque para ver a descrição.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.borderColor,
    marginVertical: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: theme.borderColor,
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
    backgroundColor: "rgba(107, 70, 193, 0.5)",
    borderWidth: 2,
    borderColor: theme.buttonText,
  },
  activeDot: {
    backgroundColor: theme.accentPurple,
    borderWidth: 2,
    borderColor: theme.buttonText,
  },

  explanationBox: {
    backgroundColor: "rgba(107, 70, 193, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    minHeight: 100,
    justifyContent: "center",
  },
  explanationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.accentPurple,
    marginBottom: 4,
  },
  explanationDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.textSecondary,
  },
});

export default ImageHighlight;
