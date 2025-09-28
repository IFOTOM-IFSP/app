import { MODULES_DATA } from "@/data";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import AnimatedListItem from "@/src/components/modules/AnimatedListItem";
import HeaderIndex from "@/src/components/modules/ModuleListHeader";
import { Padding } from "@/src/constants/Styles";
import { useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function ModuleListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <ScreenLayout>
      <HeaderIndex title="Módulos de Aprendizado" />

      <Animated.FlatList
        showsVerticalScrollIndicator={false}
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
    paddingTop: Padding.sm,
    paddingBottom: Padding.xxxl + 30,
  },
});
