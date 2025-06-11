import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PageListItemProps = {
  page: {
    id: string;
    title: string;
  };
  moduleId: string;
  displayNumber: number;
};

export function PageListItem({
  page,
  moduleId,
  displayNumber,
}: PageListItemProps) {
  return (
    <Link
      href={{
        pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
        params: { moduleId: moduleId, page: page.id },
      }}
      asChild>
      <TouchableOpacity style={styles.pageItemCard} activeOpacity={0.8}>
        <View style={styles.itemIconContainer}>
          <Text style={styles.itemNumberText}>{displayNumber}</Text>
        </View>

        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {page.title || `Conteúdo ${displayNumber}`}
          </Text>
          <Text style={styles.itemSubtitle}>Toque para abrir esta seção</Text>
        </View>

        <View style={styles.itemActionContainer}>
          <Ionicons
            name="chevron-forward-outline"
            size={22}
            color={Colors.light.gray}
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  pageItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.tabsBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: Colors.light.tint,
  },
  itemNumberText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.background,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  itemActionContainer: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
