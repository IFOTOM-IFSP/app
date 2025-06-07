// Em app/(tabs)/education/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function EducationStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}></Stack>
  );
}
