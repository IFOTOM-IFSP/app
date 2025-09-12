import { InteractiveCard } from "@/components/common/InteractiveCard";
import { Icon } from "@/components/ui/icon/Icon";
import { IconContainer } from "@/components/ui/icon/IconContainer";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontSize, FontWeight, Margin, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

// O tipo do nome do ícone continua o mesmo
type IconName = React.ComponentProps<typeof FontAwesome5>["name"];

type CardData = {
  title: string;
  description: string;
  icon?: IconName;
};

interface InfoCardsProps {
  title?: string;
  description?: string;
  cards: CardData[];
}

function InfoCard({ title, description, icon }: CardData) {
  const accentColor = useThemeValue("primary");
  const iconBgColor = useThemeValue("primaryBackground");
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth * 0.75;

  return (
    <InteractiveCard title={title} style={[styles.card, { width: cardWidth }]}>
      {icon && (
        <IconContainer
          backgroundColor={iconBgColor}
          style={{ marginBottom: Margin.md }}>
          <Icon
            library="FontAwesome5"
            name={icon}
            size={24}
            color={accentColor}
          />
        </IconContainer>
      )}
      <ThemedText style={styles.cardDescription}>{description}</ThemedText>
    </InteractiveCard>
  );
}

export function InfoCards({ title, description, cards }: InfoCardsProps) {
  const primaryText = useThemeValue("text");
  const secondaryText = useThemeValue("textSecondary");

  return (
    <View style={styles.mainContainer}>
      {title && (
        <ThemedText style={[styles.mainTitle, { color: primaryText }]}>
          {title}
        </ThemedText>
      )}
      {description && (
        <ThemedText style={[styles.mainDescription, { color: secondaryText }]}>
          {description}
        </ThemedText>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}>
        {cards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: Margin.md,
  },
  mainTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
    paddingHorizontal: Padding.md,
    marginBottom: Margin.xs,
  },
  mainDescription: {
    fontSize: FontSize.sm,
    paddingHorizontal: Padding.md,
    marginBottom: Margin.sm,
  },
  scrollViewContainer: {
    paddingHorizontal: Padding.md,
    paddingVertical: Padding.sm,
  },
  card: {
    marginRight: Margin.md,
    padding: Padding.xl,
    justifyContent: "center",
  },
  cardDescription: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    textAlign: "center",
  },
});
