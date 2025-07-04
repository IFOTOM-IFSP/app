import { useThemeValue } from "@/hooks/useThemeValue";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface BackButtonProps {
  path?: string;
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const BackButton: React.FC<BackButtonProps> = ({
  path,
  title,
  style,
  textStyle,
}) => {
  const router = useRouter();

  const backgroundColor = useThemeValue("primary");
  const foregroundColor = useThemeValue("textWhite");

  const handlePress = () => {
    if (path) {
      router.replace(path)
    } else {
      router.back();
    }
  };

  if (!!title) {
    return (
      <TouchableOpacity
        style={[styles.containerWithButton, { backgroundColor }, style]}
        onPress={handlePress}>
        <Octicons name="arrow-left" size={20} color={foregroundColor} />
        <ThemedText
          style={[
            styles.backButtonText,
            { color: foregroundColor },
            textStyle,
          ]}>
          {title}
        </ThemedText>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[styles.containerWithoutTitle, { backgroundColor }, style]}
        onPress={handlePress}>
        <Octicons name="arrow-left" size={24} color={foregroundColor} />
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  containerWithButton: {
    maxWidth: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 8,
    gap: 6,
  },
  containerWithoutTitle: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "500",
    textTransform: "uppercase",
  },
});

export default BackButton;
