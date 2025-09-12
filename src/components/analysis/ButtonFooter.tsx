import { Icon } from "@/components/ui/icon/Icon";
import { useThemeValue } from "@/hooks/useThemeValue";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ButtonFooter() {
  const colorsBackground = useThemeValue("card");
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colorsBackground }]}
      onPress={() => {}}
      activeOpacity={0.7}>
      <View style={styles.contentWrapper}>
        <Icon library={"MaterialIcons"} name={"school"} size={22} />
        <Text style={styles.title}>Guia rápido e tutoriais</Text>
      </View>

      <Icon
        library={"MaterialIcons"}
        name={"arrow-forward-ios"}
        size={18}
        color={"#0f0f0f4"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 55,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  arrowIcon: {
    opacity: 0.6,
  },
});
