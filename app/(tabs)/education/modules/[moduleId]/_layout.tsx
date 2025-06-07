import { getModuleTitleById } from "@/constants/modulesData"; // Ajuste o caminho
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function SingleModuleLayout() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const router = useRouter();
  const moduleTitle = getModuleTitleById(moduleId);

  return (
    <Stack screenOptions={{ headerBackTitle: "Módulos", headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: `${moduleTitle}: Início`,
          // Exemplo de botão no header para voltar ao Hub (opcional)
          // headerLeft: () => <Button title="Hub" onPress={() => router.replace("/(tabs)/education/hub")} />
        }}
      />
      <Stack.Screen name="p/[page]" options={{ title: moduleTitle }} />

      {/* <Stack.Screen name="simulator" options={{ title: `${moduleTitle}: Simulador`, presentation: 'modal' }} />
      <Stack.Screen name="summary" options={{ title: `${moduleTitle}: Resumo` }} />
      <Stack.Screen name="quiz" options={{ title: `${moduleTitle}: Quiz`, presentation: 'modal' }} /> 
      */}
    </Stack>
  );
}
