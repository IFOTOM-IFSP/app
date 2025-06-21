import AnimatedListItem from "@/components/specific/modules/AnimatedListItem";
import HeaderIndex from "@/components/specific/modules/ModuleListHeader";
import { ThemedView } from "@/components/ui/ThemedView";
import { Padding } from "@/constants/Styles";
import { MODULES_DATA } from "@/data/modulesData";
import { default as React, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function ModuleListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <ThemedView style={styles.container}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: Padding.xl,
    paddingTop: Padding.sm,
    paddingBottom: Padding.xl,
  },
});
