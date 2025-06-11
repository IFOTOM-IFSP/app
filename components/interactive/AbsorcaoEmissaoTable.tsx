import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const theme = Colors.light;

type TableRow = {
  aspecto: string;
  absorcao: string;
  emissao: string;
};

type AbsorcaoEmissaoTableProps = {
  data: TableRow[];
};

const AbsorcaoEmissaoTable: React.FC<AbsorcaoEmissaoTableProps> = ({
  data,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerText]}>Aspecto</Text>
        <Text style={[styles.cell, styles.headerText]}>Absorção</Text>
        <Text style={[styles.cell, styles.headerText]}>Emissão</Text>
      </View>

      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={[styles.cell, styles.aspectCell]}>{item.aspecto}</Text>
          <Text style={styles.cell}>{item.absorcao}</Text>
          <Text style={styles.cell}>{item.emissao}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
  },
  headerRow: {
    backgroundColor: theme.accentPurple,
  },
  cell: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    textAlign: "center",
    color: theme.textPrimary,
  },
  headerText: {
    fontWeight: "bold",
    color: theme.buttonText,
  },
  aspectCell: {
    fontWeight: "bold",
    textAlign: "left",
  },
});

export default AbsorcaoEmissaoTable;
