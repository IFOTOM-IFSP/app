import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import AnimatedListItem from "@/src/components/modules/AnimatedListItem";
import HeaderIndex from "@/src/components/modules/ModuleListHeader";
import { Padding } from "@/constants/Styles";
import { MODULES_DATA } from "@/data";
import { default as React, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function ModuleListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <ScreenLayout>
      <HeaderIndex title="Módulos de Aprendizado" />

      <Animated.FlatList
        data={MODULES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedListItem item={item} index={index} scrollY={scrollY} />
        )}
        contentContainerStyle={styles.flatListContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: Padding.md,
    paddingTop: Padding.sm,
    paddingBottom: Padding.xl,
  },
});
