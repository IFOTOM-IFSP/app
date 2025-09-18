import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  LayoutSize,
  Margin,
  Padding,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

type OptionButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  info?: string;
  value?: string;
};

export function OptionButton({
  label,
  onPress,
  icon,
  variant = "default",
  info,
  value,
}: OptionButtonProps) {
  const dangerBgColor = useThemeValue("dangerBackground");
  const dangerTextColor = useThemeValue("dangerText");
  const infoIconColor = useThemeValue("primary");
  const valueTextColor = useThemeValue("textSecondary");
  const cardBackgroun = useThemeValue("card");
  const isDanger = variant === "danger";

  return (
    <View
      style={[
        styles.optionContainer,
        isDanger
          ? { backgroundColor: dangerBgColor }
          : { backgroundColor: cardBackgroun },
      ]}>
      <TouchableOpacity
        style={styles.mainButton}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, valor atual: ${
          value || "não definido"
        }`}>
        <View style={styles.labelContainer}>
          {icon}
          <ThemedText
            style={[
              styles.optionText,
              icon ? styles.textWithIcon : null,
              isDanger && { color: dangerTextColor },
            ]}>
            {label}
          </ThemedText>
        </View>
        {value && (
          <ThemedText style={[styles.valueText, { color: valueTextColor }]}>
            {value}
          </ThemedText>
        )}
      </TouchableOpacity>
      {info && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => Alert.alert(label, info)}
          accessibilityRole="button"
          accessibilityLabel={`Informação sobre ${label}`}>
          <Feather name="help-circle" size={22} color={infoIconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    borderRadius: BorderRadius.md,
    marginBottom: Margin.sm,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.1,
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: Padding.md,
    paddingHorizontal: Padding.md,
    minHeight: LayoutSize.tabBarHeight,
  },
  labelContainer: { flexDirection: "row", alignItems: "center" },
  optionText: { fontSize: FontSize.lg },
  textWithIcon: { marginLeft: Margin.md },
  infoButton: {
    paddingRight: Padding.md,
    paddingLeft: Padding.sm,
  },
  valueText: {
    fontSize: FontSize.md,
  },
});
