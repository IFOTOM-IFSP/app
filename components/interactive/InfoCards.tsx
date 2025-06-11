import { Colors } from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

type IconName = React.ComponentProps<typeof FontAwesome5>["name"];

type CardData = {
  title: string;
  description: string;
  icon?: IconName;
};

const InfoCard: React.FC<CardData> = ({ title, description, icon }) => (
  <View style={styles.card}>
    {icon && (
      <View style={styles.iconContainer}>
        <FontAwesome5 name={icon} size={24} color={theme.accentPurple} />
      </View>
    )}
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </View>
);

type InfoCardsProps = {
  title?: string;
  description?: string;
  cards: CardData[];
};

export const InfoCards: React.FC<InfoCardsProps> = ({
  title,
  description,
  cards,
}) => {
  return (
    <View style={styles.mainContainer}>
      {title && <Text style={styles.mainTitle}>{title}</Text>}
      {description && <Text style={styles.mainDescription}>{description}</Text>}

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
};

const styles = StyleSheet.create({
  mainContainer: { marginVertical: 16 },
  mainTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  mainDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollViewContainer: { paddingHorizontal: 16, paddingVertical: 10 },
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: 280,
    marginRight: 16,
    borderWidth: 1,
    borderColor: theme.borderColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(107, 70, 193, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 8,
  },
  cardDescription: { fontSize: 14, lineHeight: 20, color: theme.textSecondary },
});
