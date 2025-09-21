import { CustomTabBar } from "@/src/components/layouts/CustomTabBar";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBackgroundColor = useThemeValue("background");
  const separatorColor = "#e0e0e044";

  return (
    <Tabs
      tabBar={(props) => (
        <View
          style={[
            styles.tabBarContainer,
            {
              height: 65 + insets.bottom,
              backgroundColor: tabBackgroundColor,
              borderTopColor: separatorColor,
            },
          ]}>
          <View style={{ paddingBottom: insets.bottom }}>
            <CustomTabBar {...props} />
          </View>
        </View>
      )}
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="analysis" options={{ title: "Análises" }} />
      <Tabs.Screen name="notes" options={{ title: "Anotações" }} />
      <Tabs.Screen name="education" options={{ title: "Aprendendo" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
});
