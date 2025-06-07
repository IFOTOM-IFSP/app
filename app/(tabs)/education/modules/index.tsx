import AnimatedListItem from "@/components/education/modules/AnimatedListItem";
import HeaderIndex from "@/components/education/modules/HeaderIndex";
import { Colors } from "@/constants/Colors";
import { MODULES_DATA } from "@/constants/modulesData";
import { default as React, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function ModuleListScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
