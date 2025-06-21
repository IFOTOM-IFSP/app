import { LayoutSize } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  console.log("TAB_LAYOUT: Renderizando Tabs Navigator");
  const insets = useSafeAreaInsets();
  const background = useThemeValue("background");
  const tabBarActiveTintColor = useThemeValue("tabIconSelected");
  const tabBarInactiveTintColor = useThemeValue("tabIconDefault");
  const tabBackgroundColor = useThemeValue("background");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBackgroundColor,
          position: "relative",
          borderTopColor: background,
          paddingTop: 10,
          paddingBottom: insets.bottom,
          height: LayoutSize.tabBarHeight + insets.bottom,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Análises",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="beaker-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Anotações",
          tabBarIcon: ({ color, size }) => (
            <Feather name="edit-3" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: "Aprendendo",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
