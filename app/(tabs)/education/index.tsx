import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { EducationHeroCard } from "@/src/components/education/EducationHeroCard";
import { HubListItem } from "@/src/components/education/HubListItem";
import { EducationLayout } from "@/src/components/layouts/EducationLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";

import { EDUCATION_HUB_ITEMS } from "@/data/educationData";
import { FontSize, FontWeight, Margin, Padding } from "@/src/constants/Styles";

export default function EducationHubScreen() {
  const router = useRouter();

  return (
    <EducationLayout>
      <EducationHeroCard />

      <View style={styles.listIntroduction}>
        <ThemedText style={styles.listHeaderTitle}>
          Explore as Seções
        </ThemedText>
        <ThemedText style={styles.listIntroSubtitle}>
          Sua jornada no mundo da espectrofotometria começa aqui. Explore nossos
          módulos e ferramentas.
        </ThemedText>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listItemsOuterContainer}>
          {EDUCATION_HUB_ITEMS.map((hubItem) => (
            <HubListItem
              key={hubItem.id}
              item={hubItem}
              onPress={() => router.push(hubItem.route as `/${string}`)}
            />
          ))}
        </View>
      </ScrollView>
    </EducationLayout>
  );
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingBottom: Padding.xl,
  },
  listIntroduction: {
    paddingHorizontal: Padding.xl,
    marginTop: Margin.xl,
    marginBottom: Margin.lg,
  },
  listHeaderTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.sm,
  },
  listIntroSubtitle: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.xl,
  },
  listItemsOuterContainer: {
    marginHorizontal: Margin.md,
    marginTop: Margin.sm,
  },
});
