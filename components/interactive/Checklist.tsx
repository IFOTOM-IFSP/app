import { FormattedText } from "@/components/renderers/TextBlock";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const theme = Colors.light;

type ChecklistProps = { title?: string; items: string[] };

export const Checklist: React.FC<ChecklistProps> = ({ title, items }) => {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (index: number) => {
    setCheckedState((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => toggleCheck(index)}
          activeOpacity={0.6}>
          <AntDesign
            name={checkedState[index] ? "checksquare" : "checksquareo"}
            size={24}
            color={
              checkedState[index] ? theme.accentPurple : theme.textSecondary
            }
            style={styles.icon}
          />
          <View style={styles.textWrapper}>
            <FormattedText
              text={item}
              style={[
                styles.itemText,
                checkedState[index] && styles.checkedText,
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderColor,
    padding: 20,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.textPrimary,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: theme.textSecondary,
  },
});

export default Checklist;
