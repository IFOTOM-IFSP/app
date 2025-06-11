import { Slot, SplashScreen, usePathname, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { JSX, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";
import { getUserName, isFirstLaunch } from "../storage/userStorage";

SplashScreen.preventAutoHideAsync()
  .then(() => {
    console.log(
      `SplashScreen.preventAutoHideAsync() [RootLayout Global]: Operação iniciada/completada.`
    );
  })
  .catch((error) => {
    console.warn(
      `SplashScreen.preventAutoHideAsync() [RootLayout Global] error: ${error}`
    );
  });

type Action =
  | "INITIAL_CHECK"
  | "SHOULD_GO_TO_WELCOME"
  | "SHOULD_GO_TO_APP"
  | "NAVIGATION_PENDING"
  | "READY";

export default function RootLayout(): JSX.Element {
  const [action, setAction] = useState<Action>("INITIAL_CHECK");
  const router = useRouter();
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);
  const welcomeScreenPath = "/welcome";
  const mainAppPath = "/";
  useEffect(() => {
    console.log(
      `ROOT_LAYOUT [EFFECT] - Action: ${action}, Pathname: ${pathname}, IsNavigating: ${isNavigatingRef.current}`
    );

    let isMounted = true;

    const performSideEffects = async () => {
      if (!isMounted) return;

      if (action === "INITIAL_CHECK") {
        isNavigatingRef.current = false;
        try {
          const firstLaunch = await isFirstLaunch();
          const name = await getUserName();
          console.log(
            `ROOT_LAYOUT [EFFECT] - AsyncStorage: firstLaunch=${firstLaunch}, name=${name}`
          );

          if (!isMounted) return;

          if (firstLaunch || !name) {
            console.log("ROOT_LAYOUT [EFFECT] - Decisão: SHOULD_GO_TO_WELCOME");
            setAction("SHOULD_GO_TO_WELCOME");
          } else {
            console.log("ROOT_LAYOUT [EFFECT] - Decisão: SHOULD_GO_TO_APP");
            setAction("SHOULD_GO_TO_APP");
          }
        } catch (error) {
          console.error("ROOT_LAYOUT [EFFECT] - Erro em INITIAL_CHECK:", error);
          if (isMounted) setAction("SHOULD_GO_TO_WELCOME");
        }
      } else if (action === "SHOULD_GO_TO_WELCOME") {
        if (pathname !== welcomeScreenPath) {
          if (!isNavigatingRef.current) {
            console.log(
              `ROOT_LAYOUT [EFFECT] - Navegando para Welcome: ${welcomeScreenPath} (de ${pathname})`
            );
            isNavigatingRef.current = true;
            setAction("NAVIGATION_PENDING");
            router.replace(welcomeScreenPath);
          } else {
            console.log(
              "ROOT_LAYOUT [EFFECT] - Navegação para Welcome já pendente (pathname: ${pathname})."
            );
          }
        } else {
          console.log(
            "ROOT_LAYOUT [EFFECT] - Já está em Welcome. Definindo para READY."
          );
          setAction("READY");
        }
      } else if (action === "SHOULD_GO_TO_APP") {
        if (pathname === welcomeScreenPath) {
          if (!isNavigatingRef.current) {
            console.log(
              `ROOT_LAYOUT [EFFECT] - Navegando para App: ${mainAppPath} (vindo de ${pathname})`
            );
            isNavigatingRef.current = true;
            setAction("NAVIGATION_PENDING");
            router.replace(mainAppPath);
          } else {
            console.log(
              "ROOT_LAYOUT [EFFECT] - Navegação para App (de Welcome) já pendente."
            );
          }
        } else if (pathname === mainAppPath) {
          console.log(
            `ROOT_LAYOUT [EFFECT] - Já está no App (mainAppPath: ${mainAppPath}). Definindo para READY.`
          );
          setAction("READY");
        } else {
          console.log(
            `ROOT_LAYOUT [EFFECT] - Já em uma rota do app (${pathname}) diferente de Welcome. Definindo para READY.`
          );
          setAction("READY");
        }
      } else if (action === "NAVIGATION_PENDING") {
        console.log(
          `ROOT_LAYOUT [EFFECT] - Em NAVIGATION_PENDING. Pathname atual: ${pathname}. Esperando mudança de rota...`
        );
        isNavigatingRef.current = false;
        setAction("INITIAL_CHECK");
      } else if (action === "READY") {
        isNavigatingRef.current = false;
        console.log(
          "ROOT_LAYOUT [EFFECT] - Estado é READY. Nenhuma ação de navegação neste ciclo."
        );
      }
    };
    performSideEffects();

    return () => {
      isMounted = false;
    };
  }, [action, pathname, router]);

  useEffect(() => {
    if (action === "READY") {
      console.log(
        "RootLayout: Action é READY, tentando esconder SplashScreen..."
      );
      SplashScreen.hideAsync()
        .then(() => {
          console.log(
            `SplashScreen.hideAsync() [RootLayout useEffect]: Operação completada.`
          );
        })
        .catch((error) => {
          console.warn(
            `SplashScreen.hideAsync() [RootLayout useEffect] error: ${error}`
          );
        });
    }
  }, [action]);
  console.log(
    `ROOT_LAYOUT [RENDER] - Action: ${action}, Pathname: ${pathname}`
  );

  if (action !== "READY") {
    const loaderAnimation = require("@/assets/images/loader_animation.json");
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderContainer2}>
          <Text style={styles.loaderText}>Carregando</Text>
          <LottieView
            style={styles.loaderAnimation}
            source={loaderAnimation}
            autoPlay={true}
            loop={true}
          />
        </View>
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: Colors.light.background,
  },
  loaderContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    height: 100,
    padding: 10,
  },
  loaderText: {
    fontSize: 18,
    color: Colors.light.text,
  },
  loaderAnimation: {
    width: 60,
    height: 50,
    marginLeft: -10,
  },
});
