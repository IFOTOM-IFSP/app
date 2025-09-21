import { useThemeValue } from "@/src/hooks/useThemeValue";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface AlertModalProps {
  isOpen: SharedValue<boolean>;
  toggleSheet: () => void;
  duration?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function AlertModal({
  isOpen,
  toggleSheet,
  duration = 500,
  children,
  style,
}: AlertModalProps) {
  const sheetBackgroundColor = useThemeValue("card");
  const height = useSharedValue(0);

  const translateY = useDerivedValue(() => {
    return withTiming(isOpen.value ? 0 : height.value, { duration });
  });

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: height.value === 0 ? 0 : 1,
    transform: [{ translateY: translateY.value }],
  }));

  const backdropProgress = useDerivedValue(() => {
    return withTiming(isOpen.value ? 1 : 0, { duration });
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropProgress.value,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flexFill} onPress={toggleSheet} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: sheetBackgroundColor },
          sheetStyle,
          style,
        ]}
        onLayout={(e) => {
          if (height.value === 0) {
            height.value = e.nativeEvent.layout.height;
          }
        }}>
        {children}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
    paddingBottom: 40,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  flexFill: {
    flex: 1,
  },
});
