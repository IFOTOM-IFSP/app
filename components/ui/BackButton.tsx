import { Colors } from "@/constants/Colors";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface BackButtonProps {
  onPress?: () => void;
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  title,
  style,
  textStyle,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };
  if (!!title) {
    return (
      <TouchableOpacity
        style={[styles.containerWitchButton, style]}
        onPress={handlePress}>
        <Octicons name="arrow-left" size={20} style={styles.iconWitchText} />
        <Text style={[styles.backButtonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[styles.containerWithoutTitle, style]}
        onPress={handlePress}>
        <Octicons name="arrow-left" size={24} style={styles.icon} />
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  containerWitchButton: {
    maxWidth: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 8,
    gap: 6,
  },
  containerWithoutTitle: {
    borderRadius: "50%",
    backgroundColor: Colors.light.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.light.accentPurple,
    textTransform: "uppercase",
  },
  iconWitchText: {
    color: Colors.light.accentPurple,
    textAlign: "center",
    fontWeight: "bold",
  },
  icon: {
    padding: 8,
    color: Colors.light.accentPurple,
    textAlign: "center",
    fontWeight: "bold",
  },
});
export default BackButton;
