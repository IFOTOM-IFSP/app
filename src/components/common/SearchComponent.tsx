import { ThemedInput } from "@/src/components/ui/ThemedInput";
import {
  BorderRadius,
  FontSize,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface SearchComponentProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  value,
  onChangeText,
  placeholder,
  containerStyle,
  ...restOfInputProps
}) => {
  const card = useThemeValue("card");
  const border = useThemeValue("border");
  const textSecondary = useThemeValue("textSecondary");
  return (
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: card, borderColor: border },
        containerStyle,
      ]}>
      <Feather name="search" size={20} color={textSecondary} />
      <ThemedInput
        style={styles.searchInput}
        placeholder={placeholder || "Buscar..."}
        placeholderTextColor={textSecondary}
        value={value}
        onChangeText={onChangeText}
        {...restOfInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.md,
    borderRadius: BorderRadius.md,
    marginVertical: Margin.sm,
    height: 50,
  },
  searchInput: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: Margin.sm,
    borderWidth: 0,
    fontSize: FontSize.md,
  },
});

export default SearchComponent;
