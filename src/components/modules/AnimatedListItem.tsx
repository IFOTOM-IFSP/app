import ContentCard, {
  CONTENT_CARD_HEIGHT,
} from "@/components/common/ContentCard";
import { Module } from "@/models";
import { Link } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, useWindowDimensions } from "react-native";

interface AnimatedListItemProps {
  item: Module;
  index: number;
  scrollY: Animated.Value;
}

const ITEM_SIZE = CONTENT_CARD_HEIGHT;

export default function AnimatedListItem({
  item,
  index,
  scrollY,
}: AnimatedListItemProps) {
  const animation = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);
  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const itemTop = index * ITEM_SIZE;
      const triggerPoint = itemTop - screenHeight * 0.8;

      if (value > triggerPoint && !hasAnimated.current) {
        hasAnimated.current = true;
        Animated.timing(animation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY, index, screenHeight]);

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Link
        href={{
          pathname: "/(tabs)/education/modules/[moduleId]",
          params: { moduleId: item.id },
        }}
        asChild>
        <ContentCard
          id={item.id}
          title={item.title}
          description={item.description}
          thumbnailUrl={item.thumbnailUrl}
          metaInfo={
            item.estimatedTime
              ? `Tempo estimado: ${item.estimatedTime}`
              : undefined
          }
        />
      </Link>
    </Animated.View>
  );
}
