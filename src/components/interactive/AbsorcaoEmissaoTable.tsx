import { ThemedText } from "@/src/components/ui/ThemedText";
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Margin,
  Padding,
} from "@/src/constants/Styles";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { StyleSheet, View } from "react-native";

type TableRow = {
  aspecto: string;
  absorcao: string;
  emissao: string;
};

type AbsorcaoEmissaoTableProps = {
  data: TableRow[];
};

export function AbsorcaoEmissaoTable({ data }: AbsorcaoEmissaoTableProps) {
  const borderColor = useThemeValue("border");
  const headerBgColor = useThemeValue("primary");
  const headerTextColor = useThemeValue("buttonText");
  const primaryTextColor = useThemeValue("text");

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={[styles.row, { backgroundColor: headerBgColor }]}>
        <ThemedText
          style={[styles.cell, styles.headerText, { color: headerTextColor }]}>
          Aspecto
        </ThemedText>
        <ThemedText
          style={[styles.cell, styles.headerText, { color: headerTextColor }]}>
          Absorção
        </ThemedText>
        <ThemedText
          style={[styles.cell, styles.headerText, { color: headerTextColor }]}>
          Emissão
        </ThemedText>
      </View>

      {data.map((item, index) => (
        <View
          key={index}
          style={[styles.row, { borderBottomColor: borderColor }]}>
          <ThemedText
            style={[
              styles.cell,
              styles.aspectCell,
              { color: primaryTextColor },
            ]}>
            {item.aspecto}
          </ThemedText>
          <ThemedText style={[styles.cell, { color: primaryTextColor }]}>
            {item.absorcao}
          </ThemedText>
          <ThemedText style={[styles.cell, { color: primaryTextColor }]}>
            {item.emissao}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Margin.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },

  cell: {
    flex: 1,
    padding: Padding.md,
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  headerText: {
    fontWeight: FontWeight.bold,
  },
  aspectCell: {
    fontWeight: FontWeight.bold,
    textAlign: "left",
  },
});
