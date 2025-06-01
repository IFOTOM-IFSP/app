import IconButton from "@/components/home/iconButton";
import { Colors } from "@/constants/Colors";
import { getUserName } from "@/storage/userStorage";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);

  const router = useRouter();

  useEffect(() => {
    console.log("Carregando dados");
    const loadData = async () => {
      setLoadingName(true);
      const name = await getUserName();
      setUserName(name);
      setLoadingName(false);

      setLoadingContent(true);
    };
    loadData();
  }, []);

  const handleStartAnalysis = () => {
    console.log("Botão SIM para iniciar análise clicado");
    router.push("/acquisition");
  };

  if (loadingName) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.tabActive} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {userName || "Usuário"}!</Text>
          <IconButton
            onPress={() => console.log("Ajustes Pressionado")}
            iconElement={
              <Ionicons
                name="settings-outline"
                size={20}
                color={Colors.light.textPrimary}
              />
            }
            labelText=""
            style={styles.ajusteButton}
          />
        </View>

        <TouchableOpacity
          style={styles.startAnalysisCardTouchable}
          onPress={handleStartAnalysis}
          activeOpacity={0.85}>
          <ImageBackground
            source={require("@/assets/images/backgroundHomeDashboard.png")}
            style={styles.startAnalysisCardBackground}
            imageStyle={styles.startAnalysisCardBackgroundImage}>
            <Text style={styles.startAnalysisText}>
              Quer começar uma análise?
            </Text>
            <View style={styles.startAnalysisButton}>
              <Text style={styles.startAnalysisButtonText}>SIM</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.usefulSectionsContainer}>
          <Text style={styles.sectionTitle}>Seções úteis</Text>
          <View style={styles.iconsRow}>
            <IconButton
              onPress={() => console.log("AR Scan Pressionado")}
              iconElement={
                <FontAwesome5
                  name="vr-cardboard"
                  size={26}
                  color={Colors.light.tabActive}
                />
              }
              labelText="AR Scan"
            />
            <IconButton
              onPress={() => console.log("Métodos Pressionado")}
              iconElement={
                <MaterialCommunityIcons
                  name="flask-outline"
                  size={26}
                  color={Colors.light.tabActive}
                />
              }
              labelText="Métodos"
            />
            <IconButton
              onPress={() => console.log("Outra Opção Pressionado")}
              iconElement={
                <SimpleLineIcons
                  name="question"
                  size={26}
                  color={Colors.light.tabActive}
                />
              }
              labelText="Dúvidas"
            />
            <IconButton
              onPress={function () {
                console.log("Mais Opções Pressionado");
                router.push("/options");
              }}
              iconElement={
                <SimpleLineIcons
                  name="options"
                  size={26}
                  color={Colors.light.tabActive}
                />
              }
              labelText="Mais"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    height: 70,
    width: "100%",
    paddingBottom: 20,
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 18,
    color: Colors.light.textPrimary,
  },
  ajusteButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingVertical: 0,
    paddingHorizontal: 0,
    minWidth: 60,
    minHeight: 0,
    marginRight: 0,
  },

  startAnalysisCardTouchable: {
    height: 200,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 18,
    elevation: 1,
    shadowColor: "#efefef",
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  startAnalysisCardBackground: {
    height: 200,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 18,
    overflow: "hidden",
  },
  startAnalysisCardBackgroundImage: {
    borderRadius: 18,
    resizeMode: "cover",
  },
  startAnalysisText: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.light.background,
    flexShrink: 1,
    paddingBottom: 40,
    textShadowColor: "rgba(43, 41, 41, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  startAnalysisButton: {
    width: 100,
    backgroundColor: Colors.light.background,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 18,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  startAnalysisButtonText: {
    color: Colors.light.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  usefulSectionsContainer: {
    minHeight: 120,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "medium",
    color: Colors.light.textPrimary,
    marginBottom: 8,
  },
  iconsRow: {
    width: "100%",
    flexDirection: "row",
    paddingRight: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },

  iconButtonText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
});
