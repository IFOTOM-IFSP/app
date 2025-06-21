import { PROJECT_DATA, TEAM_MEMBERS } from "@/data/aboutScreenData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ObjectiveItem } from "@/components/specific/about/ObjectiveItem";
import { TeamMemberCard } from "@/components/specific/about/TeamMemberCard";
import BackButton from "@/components/ui/BackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

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
  const tintColor = useThemeValue("tint");
  const accentColor = useThemeValue("accentPurple");
  const buttonTextColor = useThemeValue("buttonText");
  const borderColor = useThemeValue("borderColor");

  return (
    <ThemedView style={styles.safeArea}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <BackButton />
              <ThemedText style={[styles.title, { color: accentColor }]}>
                {PROJECT_DATA.name}
              </ThemedText>
            </View>
            <ThemedText style={styles.slogan}>{PROJECT_DATA.slogan}</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { borderBottomColor: tintColor }]}>
              A Nossa Missão
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              {PROJECT_DATA.mission}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { borderBottomColor: tintColor }]}>
              Os Nossos Objetivos
            </ThemedText>
            {PROJECT_DATA.objectives.map((obj, index) => (
              <ObjectiveItem key={index} text={obj} />
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { borderBottomColor: tintColor }]}>
              A Nossa Equipa
            </ThemedText>
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { borderBottomColor: tintColor }]}>
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
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: tintColor }]}
                onPress={() => openURL(PROJECT_DATA.institution.websiteUrl)}>
                <Ionicons
                  name="business-outline"
                  size={18}
                  color={buttonTextColor}
                />
                <ThemedText
                  style={[styles.actionButtonText, { color: buttonTextColor }]}>
                  Visitar Site
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContentContainer: {
    paddingVertical: Padding.lg,
    paddingHorizontal: Padding.xl,
  },
  header: {
    paddingTop: Padding.xl,
    alignItems: "flex-start",
    marginBottom: Margin.xl,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Padding.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginTop: Margin.sm,
    textAlign: "center",
    flexGrow: 3 / 4,
  },
  slogan: {
    fontSize: FontSize.md,
    marginTop: Margin.xs,
  },
  section: {
    marginBottom: Margin.xl,
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
    borderWidth: StyleSheet.hairlineWidth,
  },
  institutionLogo: {
    width: 150,
    height: 150,
    resizeMode: "cover",
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
