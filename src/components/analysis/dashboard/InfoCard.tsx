import { InfoCardData } from "@/data/analysisData";
import { useThemeValue } from "@/hooks/useThemeValue";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface InfoCardProps extends InfoCardData {
  title: string;
  subtitle: string;
  largeNumber?: string;
  smallIcon: any;
  route?: string;
}

export const InfoCard = ({
  title,
  subtitle,
  largeNumber,
  smallIcon,
  route,
}: InfoCardProps) => {
  const bgColor = useThemeValue("card");
  const titleColor = useThemeValue("text");
  const subtitleColor = useThemeValue("textSecondary");
  const largeNumberColor = "rgba(157, 78, 221, 0.42)";

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={() => router.push(route || "/")}
      activeOpacity={0.8}>
      {largeNumber && (
        <Text style={[styles.largeNumber, { color: largeNumberColor }]}>
          {largeNumber}
        </Text>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>
      <View style={styles.footer}>
        <Image source={smallIcon} style={styles.smallIcon} />
        <Text
          style={[styles.subtitle, { color: subtitleColor }]}
          numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");
const cardMargin = 12;
const numColumns = 2;
const cardWidth = (width - cardMargin * (numColumns + 1) - 37) / numColumns;

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardWidth,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 6,
    marginBottom: 20,
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.002,
    shadowRadius: 5,
    elevation: 1,
  },
  content: {},
  title: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 28,
  },
  largeNumber: {
    position: "absolute",
    bottom: -35,
    right: 0,
    fontSize: 115,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "60%",
  },
  smallIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: "#6b7280",
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "400",
    flexShrink: 1,
    marginLeft: -2,
  },
});
