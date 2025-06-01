import IconButton from "@/components/home/iconButton";
import { Colors } from "@/constants/Colors";
import { getUserName } from "@/storage/userStorage";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const router = useRouter();

  useEffect(() => {
    console.log("Carregando dados");
    const loadData = async () => {
      setLoadingName(true);
      const name = await getUserName();
      setUserName(name);
      setLoadingName(false);
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
            onPress={function () {
              router.push("/settings");
              console.log("Botão de configurações - Pressionado");
            }}
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
          <LinearGradient
            colors={[
              Colors.light.accentPurple || "#8A4DBC",
              Colors.light.tint || "#6A0DAD",
            ]}
            style={styles.startAnalysisCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.startAnalysisText}>
              Quer começar uma análise?
            </Text>
            <View style={styles.startAnalysisButton}>
              <Text style={styles.startAnalysisButtonText}>SIM</Text>
            </View>
          </LinearGradient>
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
              onPress={() => router.push("/test")}
              iconElement={
                <MaterialCommunityIcons
                  name="flask-outline"
                  size={26}
                  color={Colors.light.tabActive}
                />
              }
              labelText="Test"
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
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  startAnalysisCardGradient: {
    flex: 1,
    height: "100%",
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 18,

    justifyContent: "space-between",

    alignItems: "center",
  },
  startAnalysisText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.light.textWhite,
    flexShrink: 1,
    marginBottom: 20,
  },
  startAnalysisButton: {
    backgroundColor: Colors.light.background,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
    alignSelf: "flex-end",
  },
  startAnalysisButtonText: {
    color: Colors.light.tint,
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
