import { MODULES_DATA } from "@/constants/modulesData"; // Ajuste o caminho se necessário
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ModuleListScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={MODULES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/(tabs)/education/modules/[moduleId]",
              params: { moduleId: item.id },
            }}
            asChild>
            <TouchableOpacity style={styles.moduleItem}>
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  moduleItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  moduleTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  separator: { height: 10 },
});
