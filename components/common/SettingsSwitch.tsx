import { ThemedText } from "@/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  LayoutSize,
  Margin,
  Padding,
  Spacing,
} from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingsSwitchProps {
  label: string;
  icon?: React.ReactNode;
  isEnabled: boolean;
  onToggleSwitch: (value: boolean) => void;
  info?: string;
}

export function SettingsSwitch({
  label,
  icon,
  isEnabled,
  onToggleSwitch,
  info,
}: SettingsSwitchProps) {
  const trackColorFalse = useThemeValue("switchTrackFalse");
  const trackColorTrue = useThemeValue("switchTrackTrue");
  const thumbColorEnabled = useThemeValue("accentPurple");
  const thumbColorDisabled = useThemeValue("switchThumbDisabled");
  const infoIconColor = useThemeValue("tabIconDefault");
  const cardBackgroun = useThemeValue("cardBackground");

  return (
    <View style={[styles.optionContainer, { backgroundColor: cardBackgroun }]}>
      <View style={styles.labelContainer}>
        {icon}
        <ThemedText style={[styles.optionText, styles.textWithIcon]}>
          {label}
        </ThemedText>
      </View>

      <View style={styles.switchContainer}>
        {info && (
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => Alert.alert(label, info)}
            accessibilityRole="button"
            accessibilityLabel={`Informação sobre ${label}`}>
            <Feather name="help-circle" size={22} color={infoIconColor} />
          </TouchableOpacity>
        )}
        <Switch
          trackColor={{ false: trackColorFalse, true: trackColorTrue }}
          thumbColor={isEnabled ? thumbColorEnabled : thumbColorDisabled}
          onValueChange={onToggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    minHeight: LayoutSize.tabBarHeight,
    borderRadius: BorderRadius.md,
    marginBottom: Margin.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Padding.md,
    borderWidth: 0.2,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: FontSize.lg,
  },
  textWithIcon: {
    marginLeft: Margin.md,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoButton: {
    paddingLeft: Padding.sm,
    marginRight: Spacing.xs,
  },
});
