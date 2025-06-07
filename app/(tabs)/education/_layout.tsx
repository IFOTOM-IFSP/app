// Em app/(tabs)/education/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function EducationStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Aprenda Sobre Espectrofotometria",
        }}
      />
      <Stack.Screen
        name="modules"
        options={{ title: "Módulos de Aprendizagem" }}
      />
      <Stack.Screen
        name="tools"
        options={{ title: "Ferramentas Interativas" }}
      />
      <Stack.Screen
        name="challenges"
        options={{ title: "Desafios e Quizzes" }}
      />
      <Stack.Screen name="glossary" options={{ title: "Glossário" }} />
    </Stack>
  );
}
