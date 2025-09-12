import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Defs,
  Path,
  Stop,
  Svg,
  LinearGradient as SvgGradient,
} from "react-native-svg";

import { FontSize, FontWeight } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";

export const HEADER_HEIGHT = 220;

interface FinanceHeaderProps {
  title: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export function FinanceHeader({
  title,
  showBackButton = false,
  children,
}: FinanceHeaderProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const gradientColors = useThemeValue("cardGradient");

  const handleBackPress = () => router.back();

  const mainHeight = HEADER_HEIGHT - 60;
  const curvePeak = HEADER_HEIGHT;

  return (
    <View style={[styles.container, { height: HEADER_HEIGHT }]}>
      <Svg
        width={width}
        height={HEADER_HEIGHT}
        style={{ position: "absolute" }}>
        <Defs>
          <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </SvgGradient>
        </Defs>
        <Path
          d={`M 0 0 L ${width} 0 L ${width} ${mainHeight} Q ${
            width / 2
          } ${curvePeak} 0 ${mainHeight} Z`}
          fill="url(#grad)"
        />
      </Svg>

      <View style={[styles.contentContainer, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <View style={styles.sideComponent}>
            {showBackButton && (
              <Pressable onPress={handleBackPress} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color="white" />
              </Pressable>
            )}
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.sideComponent} />
        </View>
        <View style={styles.childrenContainer}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  sideComponent: {
    width: 40,
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: FontSize.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: "white",
  },
  childrenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
});
