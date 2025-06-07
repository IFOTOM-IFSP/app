import { Stack } from "expo-router";
import React from "react";

export default function ModulesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Módulos de Aprendizagem", headerShown: false }}
      />
      <Stack.Screen name="[moduleId]" options={{ headerShown: false }} />
    </Stack>
  );
}
