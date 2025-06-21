
import { Alert, Linking } from "react-native";


export const openEmail = async (
  email: string,
  subject: string = "",
  body: string = ""
): Promise<void> => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  let url = `mailto:${email}`;

  if (encodedSubject || encodedBody) {
    url += `?subject=${encodedSubject}&body=${encodedBody}`;
  }

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Não foi possível abrir o aplicativo de e-mail. URL: ${url}`);
      Alert.alert(
        "Erro",
        "Não foi possível abrir o aplicativo de e-mail. Por favor, verifique se você tem um configurado."
      );
    }
  } catch (error) {
    console.error("Erro ao tentar abrir o e-mail:", error);
    Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o e-mail.");
  }
};

export const openURL = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Erro", `Não foi possível abrir este link: ${url}`);
    }
  } catch (error) {
    console.error("Erro ao tentar abrir URL:", error);
    Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o link.");
  }
};