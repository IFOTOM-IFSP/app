import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EducationHeroCard } from "@/components/education/EducationHeroCard";
import { HubListItem } from "@/components/education/HubListItem";
import {
  BACKGROUND_COLOR_LIGHT,
  Colors,
  PRIMARY_COLOR_HEX,
  PRIMARY_COLOR_RGB,
} from "@/constants/Colors";
import { EDUCATION_HUB_ITEMS } from "@/constants/educationData";

export default function EducationHubScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[
        PRIMARY_COLOR_HEX,
        PRIMARY_COLOR_RGB,
        BACKGROUND_COLOR_LIGHT,
        BACKGROUND_COLOR_LIGHT,
        BACKGROUND_COLOR_LIGHT,
      ]}
      style={styles.gradientBackground}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 0.0, y: 0.4 }}>
      <EducationHeroCard />

      <View style={styles.listIntroduction}>
        <Text style={styles.listHeaderTitle}>Explore as Seções</Text>
        <Text style={styles.listIntroSubtitle}>
          Sua jornada no mundo da espectrofotometria começa aqui. Explore nossos
          módulos e ferramentas.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listItemsOuterContainer}>
          {EDUCATION_HUB_ITEMS.map((hubItem) => (
            <HubListItem
              key={hubItem.id}

              item={hubItem}
              onPress={() => router.push(hubItem.route as any)} 
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  listIntroduction: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.textPrimary,
    marginBottom: 8,
  },
  listIntroSubtitle: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    lineHeight: 20,
  },
  listItemsOuterContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },
});
