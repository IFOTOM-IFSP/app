import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/constants/Styles";
import { HubItem as HubItemType } from "@/data/educationData";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface HubListItemProps {
  item: HubItemType;
  onPress: () => void;
}

export function HubListItem({ item, onPress }: HubListItemProps) {
  const cardBackgroundColor = useThemeValue("card");
  const shadowColor = useThemeValue("shadow");
  const chevronColor = useThemeValue("primary");
  const buttonTextColor = useThemeValue("buttonText");
  const iconColor = useThemeValue(item.iconColorName as any);
  const iconBackgroundColor = useThemeValue(
    item.iconBackgroundColorName as any
  );

  return (
    <TouchableOpacity
      style={[
        styles.hubItemCard,
        { backgroundColor: cardBackgroundColor, shadowColor },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`${item.title}, ${item.subtitle}`}>
      <View
        style={[
          styles.itemIconContainer,
          { backgroundColor: iconBackgroundColor },
        ]}>
        <Ionicons name={item.iconName as any} size={24} color={iconColor} />
      </View>

      <View style={styles.itemTextContainer}>
        <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.itemSubtitle}>{item.subtitle}</ThemedText>
      </View>

      <View style={styles.itemActionContainer}>
        {item.actionText ? (
          <View style={[styles.actionButton, { backgroundColor: iconColor }]}>
            <ThemedText
              style={[styles.actionButtonText, { color: buttonTextColor }]}>
              {item.actionText}
            </ThemedText>
          </View>
        ) : (
          <Ionicons
            name="chevron-forward-outline"
            size={22}
            color={chevronColor}
            accessible={false}
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
    padding: Padding.md,
    borderRadius: BorderRadius.md,
    marginBottom: Margin.md,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.01,
    shadowRadius: 2,
    elevation: 2,
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Margin.md,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.lg,
  },
  itemActionContainer: {
    marginLeft: Margin.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    paddingVertical: Padding.xs,
    paddingHorizontal: Padding.sm,
    borderRadius: BorderRadius.full,
  },
  actionButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
