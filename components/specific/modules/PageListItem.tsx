import { IconContainer } from "@/components/ui/IconContainer";
import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type PageListItemProps = {
  page: { id: string; title: string };
  moduleId: string;
  displayNumber: number;
};

export function PageListItem({
  page,
  moduleId,
  displayNumber,
}: PageListItemProps) {
  const cardBg = useThemeValue("cardBackground");
  const tint = useThemeValue("tint");
  const iconText = useThemeValue("buttonText");
  const chevron = useThemeValue("gray");
  const subtitle = useThemeValue("textSecondary");
  const shadow = useThemeValue("shadowColor");

  return (
    <Link
      href={{
        pathname: "/(tabs)/education/modules/[moduleId]/p/[page]",
        params: { moduleId: moduleId, page: page.id },
      }}
      asChild>
      <TouchableOpacity
        activeOpacity={0.8}
        accessibilityLabel={`${displayNumber}. ${page.title}, Toque para abrir esta seção`}>
        <View
          style={[
            styles.pageItemCard,
            { backgroundColor: cardBg, shadowColor: shadow },
          ]}>
          <IconContainer color={tint} style={styles.itemIconContainer}>
            <ThemedText style={[styles.itemNumberText, { color: iconText }]}>
              {displayNumber}
            </ThemedText>
          </IconContainer>

          <View style={styles.itemTextContainer}>
            <ThemedText style={styles.itemTitle} numberOfLines={1}>
              {page.title || `Conteúdo ${displayNumber}`}
            </ThemedText>
            <ThemedText style={[styles.itemSubtitle, { color: subtitle }]}>
              Toque para abrir esta seção
            </ThemedText>
          </View>

          <View style={styles.itemActionContainer}>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color={chevron}
              accessible={false}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  pageItemCard: {
    flexDirection: "row",
    padding: Padding.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Margin.md,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    minHeight: 80,
  },
  itemIconContainer: {
    marginRight: Margin.md,
    // O justifyContent: 'center' já está dentro do componente IconContainer
  },
  itemNumberText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  itemTextContainer: {
    flex: 1,
    // 2. ADICIONADO! Centraliza o título e subtítulo verticalmente.
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    marginBottom: Spacing.xs,
  },
  itemSubtitle: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.lg,
  },
  itemActionContainer: {
    marginLeft: Margin.sm,

    justifyContent: "center",
  },
});
