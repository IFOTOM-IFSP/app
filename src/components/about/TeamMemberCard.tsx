import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
  Spacing,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { TeamMember } from "@/src/models";
import { openURL } from "@/src/utils/linkingUtils";
import { AntDesign } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const tintColor = useThemeValue("tint");
  const cardBackgroun = useThemeValue("card");

  return (
    <View style={[styles.teamMemberCard, { backgroundColor: cardBackgroun }]}>
      <Image source={{ uri: member.photoUrl }} style={styles.teamMemberPhoto} />
      <View style={styles.teamMemberInfo}>
        <ThemedText style={styles.teamMemberName}>{member.name}</ThemedText>
        <ThemedText style={[styles.teamMemberRole, { color: tintColor }]}>
          {member.role}
        </ThemedText>
        <ThemedText style={styles.teamMemberBio}>{member.bio}</ThemedText>
        <View style={styles.socialIconsContainer}>
          {member.social.linkedin && (
            <TouchableOpacity
              onPress={() => openURL(member.social.linkedin!)}
              accessibilityRole="button"
              accessibilityLabel={`LinkedIn de ${member.name}`}>
              <AntDesign name="linkedin-square" size={28} color={tintColor} />
            </TouchableOpacity>
          )}
          {member.social.github && (
            <TouchableOpacity
              onPress={() => openURL(member.social.github!)}
              accessibilityRole="button"
              accessibilityLabel={`GitHub de ${member.name}`}>
              <AntDesign name="github" size={28} color={tintColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teamMemberCard: {
    borderRadius: BorderRadius.lg,
    padding: Padding.md,
    marginBottom: Margin.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  teamMemberPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Margin.md,
    backgroundColor: "#ccc",
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  teamMemberRole: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.sm,
  },
  teamMemberBio: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.xl,
    marginBottom: Margin.md,
    textAlign: "justify",
  },
  socialIconsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: "auto",
  },
});
