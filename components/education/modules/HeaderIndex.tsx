import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface HeaderIndexProps {
  title?: string;
}

export default function HeaderIndex({ title }: HeaderIndexProps) {
  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.contentWrapper}>
        {!!title && <Text style={styles.title}> {title}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background,
    shadowColor: Colors.light.cardBackground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    borderEndEndRadius: 60,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.tint,
  },
});
