import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useThemeValue } from "@/hooks/useThemeValue";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function AnalysisScreen() {
  const router = useRouter();
  const backgroundColor = useThemeValue("background");
  const tintColor = useThemeValue("tint");

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add your analysis content here */}
      </ScrollView>
    </ScreenLayout>
  );
}
