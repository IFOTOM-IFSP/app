import { FontSize, FontWeight, Margin } from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface FilterTabsProps<T> {
  title?: string;
  data: T[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  getValue: (item: T) => string;
  getLabel: (item: T) => string;
  style?: StyleProp<ViewStyle>;
}

const FilterTabs = <T,>({
  title,
  data,
  selectedValue,
  onSelect,
  getValue,
  getLabel,
  style,
}: FilterTabsProps<T>) => {
  const cardBg = useThemeValue("card");
  const borderColor = useThemeValue("border");
  const accentColor = useThemeValue("primary");
  const primaryText = useThemeValue("text");
  const buttonText = useThemeValue("buttonText");

  return (
    <View style={styles.container}>
      {title && (
        <ThemedText style={[styles.filterSectionTitle, { color: primaryText }]}>
          {title}
        </ThemedText>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[style]}>
        {data.map((item) => {
          const itemValue = getValue(item);
          const itemLabel = getLabel(item);
          const isActive = selectedValue === itemValue;

          return (
            <TouchableOpacity
              key={itemValue}
              style={[
                styles.filterButton,
                { backgroundColor: cardBg, borderColor },
                isActive && {
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                },
              ]}
              onPress={() => onSelect(itemValue)}>
              <ThemedText
                style={[
                  styles.filterButtonText,
                  { color: primaryText },
                  isActive && { color: buttonText },
                ]}>
                {itemLabel}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Margin.md,
  },
  filterSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    marginBottom: Margin.md,
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 0.3,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    fontWeight: "600",
  },
});

export default FilterTabs;
