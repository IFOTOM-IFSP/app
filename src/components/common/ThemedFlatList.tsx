import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import React from "react";
import { FlatList, FlatListProps, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ThemedFlatListProps<T>
  extends Omit<FlatListProps<T>, "renderItem" | "keyExtractor"> {
  renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  emptyMessage: string;
  emptySubMessage?: string;
}

const ThemedFlatList = <T,>({
  data,
  renderItem,
  keyExtractor,
  emptyMessage,
  emptySubMessage,
  ...rest
}: ThemedFlatListProps<T>) => {
  const textColor = useThemeValue("text");
  const textSecondary = useThemeValue("textSecondary");
  const insets = useSafeAreaInsets();

  const tabBarHeight = 70 + 20;
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyText, { color: textColor }]}>
        {emptyMessage}
      </ThemedText>
      {emptySubMessage && (
        <ThemedText style={{ color: textSecondary }}>
          {emptySubMessage}
        </ThemedText>
      )}
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyComponent}
      keyExtractor={keyExtractor}
      contentContainerStyle={{
        paddingTop: insets.top,
      }}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default ThemedFlatList;
