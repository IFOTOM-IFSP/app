import { useThemeValue} from "@/hooks/useThemeValue";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import React from "react";

export type ThemedIconProps = {
  iconComponent: React.ComponentType<IconProps<any>>;
  name: string;
  size?: number;
  style?: IconProps<any>["style"];
  lightColor?: string;
  darkColor?: string;
};

export function ThemedIcon({
  iconComponent: Icon,
  lightColor,
  darkColor,
  ...rest
}: ThemedIconProps) {
  const color = useThemeValue(
    "accentPurple"
  );

  return <Icon color={color} {...rest} />;
}
