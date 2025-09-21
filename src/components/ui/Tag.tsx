import { BorderRadius, FontSize, Padding } from "@/constants/Styles";
import { useThemeValue } from "@/hooks/useThemeValue";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Icon, IconLibrary } from "./icon/Icon";
import { ThemedText } from "./ThemedText";

type TagVariant = "primary" | "success" | "warning" | "error";

interface TagProps {
  text: string;
  variant?: TagVariant;
  iconName?: string;
  iconLibrary?: IconLibrary;
  size?: "sm" | "md";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Tag({
  text,
  variant,
  iconName,
  iconLibrary,
  size = "md",
  style,
  textStyle,
}: TagProps) {
  const isSmall = size === "sm";

  const backgroundColor = useThemeValue(`${variant}Background` as any);
  const textColor = useThemeValue(`${variant}Text` as any);
  const iconSize = isSmall ? 12 : 14;

  return (
    <View
      style={[
        styles.tag,
        isSmall && styles.tagSmall,
        { backgroundColor },
        style,
      ]}>
      {iconName && iconLibrary && (
        <Icon
          library={iconLibrary}
          name={iconName}
          size={iconSize}
          color={textColor}
        />
      )}
      <ThemedText
        style={[
          styles.tagText,
          isSmall && styles.tagTextSmall,
          { color: textColor },
          textStyle,
        ]}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Padding.xs,
    paddingHorizontal: Padding.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  tagText: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  tagSmall: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    gap: 4,
  },
  tagTextSmall: {
    fontSize: 10,
    fontWeight: "600",
  },
});
