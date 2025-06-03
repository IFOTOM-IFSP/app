import IconButton from "@/components/ui/IconButton";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SectionItem {
  id: string;
  label: string;
  iconName: string;
  iconComponent: React.ComponentType<any>;
  onPress: () => void;
}

interface UsefulSectionsProps {
  sections: SectionItem[];
}

export function UsefulSections({ sections }: UsefulSectionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seções úteis</Text>
      <View style={styles.iconsRow}>
        {sections.map((section) => {
          const IconComponent = section.iconComponent;
          return (
            <IconButton
              key={section.id}
              onPress={section.onPress}
              iconElement={
                <IconComponent
                  name={section.iconName}
                  size={26}
                  color={Colors.light.tabActive}
                />
              }
              labelText={section.label}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.light.textPrimary,
    marginBottom: 15,
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    gap: 10,
  },
});
