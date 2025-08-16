import { PROJECT_DATA, TEAM_MEMBERS } from "@/data/aboutScreenData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { ObjectiveItem } from "@/components/specific/about/ObjectiveItem";
import { TeamMemberCard } from "@/components/specific/about/TeamMemberCard";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import TitleSection from "@/components/common/TitleSection";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Button } from "@/components/ui/Button";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { openURL } from "@/utils/linkingUtils";

export default function AboutScreen() {
  const primaryColor = useThemeValue("primary");
  const buttonTextColor = useThemeValue("buttonText");
  const borderColor = useThemeValue("border");

  return (
    <ScreenLayout>
      <TitleSection title={PROJECT_DATA.name} subtitle={PROJECT_DATA.slogan} />
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText
            style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            A Nossa Missão
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {PROJECT_DATA.mission}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText
            style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            Os Nossos Objetivos
          </ThemedText>
          {PROJECT_DATA.objectives.map((obj, index) => (
            <ObjectiveItem key={index} text={obj} />
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText
            style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            A Nossa Equipa
          </ThemedText>
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText
            style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>
            Instituição
          </ThemedText>
          <ThemedView style={[styles.institutionContainer, { borderColor }]}>
            <Image
              source={{ uri: PROJECT_DATA.institution.logoUrl }}
              style={styles.institutionLogo}
            />
            <ThemedText style={styles.institutionName}>
              {PROJECT_DATA.institution.name}
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              {PROJECT_DATA.institution.description}
            </ThemedText>
            <Button
              style={styles.actionButton}
              onPress={() => openURL(PROJECT_DATA.institution.websiteUrl)}
              icon={
                <Ionicons
                  name="business-outline"
                  size={18}
                  color={buttonTextColor}
                />
              }
              title="Visitar Site"
            />
          </ThemedView>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingBottom: Padding.lg,
  },

  section: {
    paddingTop: Padding.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.md,
    borderBottomWidth: 1,
    paddingBottom: Padding.sm,
  },
  paragraph: {
    fontSize: FontSize.md,
    lineHeight: Spacing.lg,
    textAlign: "justify",
  },
  actionButton: {
    marginTop: Margin.xl,
    width: "100%",
    borderRadius: BorderRadius.xl,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: Padding.sm,
    paddingHorizontal: Padding.md,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    textAlign: "center",
  },
  institutionContainer: {
    borderRadius: BorderRadius.md,
    padding: Padding.xl,
    alignItems: "center",
    borderWidth: 0.8,
  },
  institutionLogo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: Margin.md,
    borderRadius: BorderRadius.md,
  },
  institutionName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Margin.sm,
    textAlign: "left",
    width: "100%",
  },
});
