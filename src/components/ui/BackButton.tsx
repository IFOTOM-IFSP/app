import { useThemeValue } from "@/src/hooks/useThemeValue";
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
  color?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  path,
  title,
  style,
  textStyle,
  color,
}) => {
  const router = useRouter();
  const backgroundColor = useThemeValue("primary");
  const foregroundColor = color ? color : useThemeValue("textWhite");

  const handlePress = () => {
    if (path) {
      router.replace(path);
    } else {
      router.back();
    }
  };

  const containerStyle = [
    styles.baseContainer,
    title ? styles.containerWithTitle : styles.containerWithoutTitle,
    { backgroundColor },
    style,
  ];

  return (
    <TouchableOpacity style={containerStyle} onPress={handlePress}>
      <Octicons
        name="arrow-left"
        size={title ? 20 : 24}
        color={foregroundColor}
      />
      {title && (
        <ThemedText
          style={[
            styles.backButtonText,
            { color: foregroundColor },
            textStyle,
          ]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 8,
  },
  containerWithTitle: {
    maxWidth: 200,
    gap: 6,
  },
  containerWithoutTitle: {
    width: 40,
    height: 40,
    padding: 0,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "500",
    textTransform: "uppercase",
  },
});

export default BackButton;
