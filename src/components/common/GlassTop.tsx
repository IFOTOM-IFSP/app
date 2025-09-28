// components/GlassBackdropHeader.tsx
import { Padding } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  intensity?: number;
  tint?: "light" | "dark" | "default";
  minHeight?: number; // altura mínima opcional
  paddingV?: number; // padding vertical extra opcional
  safeTop?: boolean;
}>;

export default function GlassTop({
  children,
  intensity = 40,
  tint = "light",
  minHeight = 60,
  paddingV, // se não passar, uso Padding.lg
  safeTop = true,
}: Props) {
  const background = useThemeValue("background");
  const insets = useSafeAreaInsets();
  const padTop = (safeTop ? insets.top : 0) + (paddingV ?? Padding.xxl);
  const padBottom = paddingV ?? Padding.lg;

  return (
    <View style={[styles.wrap, { minHeight }]}>
      <LinearGradient
        colors={[background, "#f4affd6b", background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(255,255,255,0.18)" },
        ]}
      />

      <View
        style={[
          styles.content,
          { paddingTop: padTop, paddingBottom: padBottom },
        ]}>
        {children}
      </View>
    </View>
  );
}

const R = 24;

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: R,
    borderBottomRightRadius: R,
  },
  content: {
    paddingHorizontal: Padding.lg,
    justifyContent: "center",
  },
});
