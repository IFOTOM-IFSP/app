import { Colors } from "@/constants/Colors";
import { HubItem as HubItemType } from "@/constants/educationData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HubListItemProps {
  item: Omit<HubItemType, "route">;
  onPress: () => void;
}

export function HubListItem({ item, onPress }: HubListItemProps) {
  return (
    <TouchableOpacity
      style={styles.hubItemCard}
      onPress={onPress}
      activeOpacity={0.8}>
      <View
        style={[
          styles.itemIconContainer,
          { backgroundColor: item.iconBackgroundColor },
        ]}>
        <Ionicons name={item.iconName} size={24} color={item.iconColor} />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.itemActionContainer}>
        {item.actionText ? (
          <View
            style={[styles.actionButton, { backgroundColor: item.iconColor }]}>
            <Text style={styles.actionButtonText}>{item.actionText}</Text>
          </View>
        ) : (
          <Ionicons
            name="chevron-forward-outline"
            size={22}
            color={Colors.light.gray }
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hubItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
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
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.textPrimary,
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
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  actionButtonText: {
    color: Colors.light.textWhite,
    fontSize: 12,
    fontWeight: "bold",
  },
});
