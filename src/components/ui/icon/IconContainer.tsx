import { LayoutSize } from "@/constants/Styles";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface IconContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export function IconContainer({
  children,
  style,
  backgroundColor,
}: IconContainerProps) {
  return (
    <View
      style={[styles.container, { backgroundColor: backgroundColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: LayoutSize.iconContainerSize,
    height: LayoutSize.iconContainerSize,
    justifyContent: "center",
    alignItems: "center",
  },
});
