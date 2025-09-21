import { ScreenLayout } from "@/src/components/layouts/ScreenLayout";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { useThemeValue } from "@/src/hooks/useThemeValue";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  const tint = useThemeValue("tint");
  const router = useRouter();

  useEffect(() => {
    const timerId = setTimeout(() => {
      router.replace("/");
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);
  return (
    <ScreenLayout>
      <View style={styles.container}>
        <ThemedText style={[styles.title, { color: tint }]}>
          Ops! Essa tela não foi encontrada.
        </ThemedText>
        <Image
          style={[styles.image]}
          source={require("@/assets/images/m_404.png")}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: 800,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  image: {
    width: 300,
    height: 400,
  },
});
