import { useThemeValue } from "@/hooks/useThemeValue";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Feather } from "lucide-react-native";
import React from "react";

export type IconLibrary =
  | "Octicons"
  | "Ionicons"
  | "Feather"
  | "FontAwesome5"
  | "SimpleLineIcons"
  | "MaterialCommunityIcons"
  | "MaterialIcons";

interface IconProps {
  library: IconLibrary;
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ library, name, size = 24, color }: IconProps) {
  const themeTextColor = useThemeValue("text");

  const IconComponent = {
    Octicons: Octicons,
    Ionicons: Ionicons,
    Feather: Feather,
    FontAwesome5: FontAwesome5,
    SimpleLineIcons: SimpleLineIcons,
    MaterialCommunityIcons: MaterialCommunityIcons,
    MaterialIcons: require("@expo/vector-icons").MaterialIcons,
  }[library];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      name={name as any}
      size={size}
      color={color || themeTextColor}
    />
  );
}
