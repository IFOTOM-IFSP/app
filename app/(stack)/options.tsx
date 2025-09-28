import { Sections_Grid_DATA } from "@/data/SectionsGridData";
import { SectionsGrid } from "@/src/components/common/SectionsGrid";
import TitleSection from "@/src/components/common/TitleSection";
import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { StyleSheet } from "react-native";

export default function OptionsScreen() {
  const items = Sections_Grid_DATA;

  return (
    <ScreenLayout>
      <TitleSection title="Mais opções" />
      <SectionsGrid
        style={styles.sections}
        title={false}
        sections={items}
        variant="options"
        numColumns={3}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sections: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
  },
});
