import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MotiView } from "moti";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconProps = { focused: boolean; color: string; size: number };
type RouteName = "index" | "analysis" | "notes" | "education";

const ICONS: Record<RouteName, (props: IconProps) => React.ReactNode> = {
  index: (p) => <Ionicons name={p.focused ? "home" : "home-outline"} {...p} />,
  analysis: (p) => (
    <MaterialCommunityIcons
      name={p.focused ? "beaker" : "beaker-outline"}
      {...p}
    />
  ),
  notes: (p) => <Feather name="edit-3" {...p} />,
  education: (p) => (
    <Ionicons name={p.focused ? "book" : "book-outline"} {...p} />
  ),
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const primaryColor = useThemeValue("primary");
  const inactiveColor = useThemeValue("disabledText");

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;
        const color = isFocused ? primaryColor : inactiveColor;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            <MotiView
              style={styles.itemContent}
              transition={{ type: "spring", damping: 8, stiffness: 200 }}
              animate={{
                translateY: isFocused ? -2 : 0,
                scale: isFocused ? 1.1 : 1,
              }}>
              {ICONS[route.name as RouteName]({
                color,
                size: 26,
                focused: isFocused,
              })}
              <Text style={[styles.labelText, { color }]}>{label}</Text>
            </MotiView>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: "100%",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
});
