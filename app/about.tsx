import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl: string;
  social: {
    linkedin?: string;
    github?: string;
  };
};

const PROJECT_DATA = {
  name: "iFOTOM",
  slogan: "Análises espectrofotométricas na palma da sua mão.",
  mission:
    "A nossa missão é o desenvolvimento de um espectrofotômetro de absorção na faixa da luz visível de baixo custo para uso em smartphones, oferecendo uma alternativa acessível para o ensino de espectrofotometria.",
  objectives: [
    "Facilitar o ensino da espectrofotômetria.",
    "Fornecer materiais de estudo.",
    "Disponibilizar o sistema de análises fácil e prático.",
  ],
  institution: {
    name: "IFSP Câmpus Campinas",
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp7UxWb91NqWfoHf2DpzIP7XgdGgOOA46WNw&s",
    description:
      "Este é um projeto desenvolvido com o apoio do IFSP - Campinas, comprometida com o avanço da tecnologia e educação.",
    websiteUrl: "https://cmp.ifsp.edu.br/",
  },
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Luana Iório Fantinatti",
    role: " Designer UX/UI",
    // bio: "Apaixonada por criar experiências que sejam intuitivas e bonitas, focando na intersecção entre tecnologia e design centrado no usuário.",
    photoUrl:
      "data:image/jpeg;base64,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",
    social: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
    },
  },
  {
    id: "2",
    name: "Lucas Biazon Palma",
    role: "Desenvolvedor Full-Stack",
    // bio: "Focado em construir uma arquitetura de software robusta e escalável para garantir performance e manutenibilidade a longo prazo.",
    photoUrl: "https://avatars.githubusercontent.com/u/129486114?v=4C",
    social: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/lucasBiazon",
    },
  },
  {
    id: "3",
    name: "Victor Samuel dos Santos",
    role: "Desenvolvedor Full-Stack",
    // bio: "Focado em construir uma arquitetura de software robusta e escalável para garantir performance e manutenibilidade a longo prazo.",
    photoUrl:
      "data:image/jpeg;base64,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",
    social: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
    },
  },
];

const theme = Colors.light;

const ObjectiveItem = ({ text }: { text: string }) => (
  <View style={styles.objectiveItem}>
    <Ionicons
      name="checkmark-circle-outline"
      size={22}
      color={theme.tint}
      style={styles.objectiveIcon}
    />
    <Text style={styles.objectiveText}>{text}</Text>
  </View>
);

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <View style={styles.teamMemberCard}>
      <Image source={{ uri: member.photoUrl }} style={styles.teamMemberPhoto} />
      <View style={styles.teamMemberInfo}>
        <Text style={styles.teamMemberName}>{member.name}</Text>
        <Text style={styles.teamMemberRole}>{member.role}</Text>
        <Text style={styles.teamMemberBio}>{member.bio}</Text>
        <View style={styles.socialIconsContainer}>
          {member.social.linkedin && (
            <TouchableOpacity
              onPress={() => Linking.openURL(member.social.linkedin!)}>
              <AntDesign name="linkedin-square" size={28} color={theme.tint} />
            </TouchableOpacity>
          )}
          {member.social.github && (
            <TouchableOpacity
              onPress={() => Linking.openURL(member.social.github!)}>
              <AntDesign name="github" size={28} color={theme.tint} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <BackButton />
            <Text style={styles.title}>{PROJECT_DATA.name}</Text>
          </View>
          <Text style={styles.slogan}>{PROJECT_DATA.slogan}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A Nossa Missão</Text>
          <Text style={styles.paragraph}>{PROJECT_DATA.mission}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Os Nossos Objetivos</Text>
          {PROJECT_DATA.objectives.map((obj, index) => (
            <ObjectiveItem key={index} text={obj} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A Nossa Equipa</Text>
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instituição</Text>
          <View style={styles.institutionContainer}>
            <Image
              source={{ uri: PROJECT_DATA.institution.logoUrl }}
              style={styles.institutionLogo}
            />
            <Text style={styles.institutionName}>
              {PROJECT_DATA.institution.name}
            </Text>
            <Text style={styles.paragraph}>
              {PROJECT_DATA.institution.description}
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Linking.openURL(PROJECT_DATA.institution.websiteUrl)
              }>
              <Ionicons
                name="business-outline"
                size={18}
                color={theme.textWhite}
              />
              <Text style={styles.actionButtonText}>Visitar Site</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    alignItems: "flex-start",
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.accentPurple,
    marginTop: 12,
    textAlign: "center",
    flexGrow: 3 / 4,
  },
  slogan: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.textPrimary,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.tint,
    paddingBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.textPrimary,
    textAlign: "justify",
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  objectiveIcon: {
    marginRight: 12,
  },
  objectiveText: {
    flex: 1,
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  teamMemberCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: theme.borderColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 1,
  },
  teamMemberPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: theme.borderColor,
    borderWidth: 0.1,
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPrimary,
  },
  teamMemberRole: {
    fontSize: 14,
    color: theme.tint,
    fontWeight: "600",
    marginBottom: 8,
  },
  teamMemberBio: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: "justify",
  },
  socialIconsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: "auto",
  },
  actionButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButtonText: {
    color: Colors.light.textWhite,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  institutionContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: theme.borderColor,
  },
  institutionLogo: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginBottom: 16,
    backgroundColor: "#004A2F",
    borderRadius: 10,
  },
  institutionName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 12,
    textAlign: "left",
    width: "100%",
  },
});
