import { LayoutSize } from "@/constants/Styles";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface IconContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export function IconContainer({ children, style, color }: IconContainerProps) {
  return (
    <View style={[styles.container, { backgroundColor: color }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: LayoutSize.iconContainerSize,
    height: LayoutSize.iconContainerSize,
    borderRadius: LayoutSize.iconContainerSize / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
