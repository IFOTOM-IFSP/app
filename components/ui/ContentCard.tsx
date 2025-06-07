import { Colors } from "@/constants/Colors";
import { Image } from "expo-image"; // 2. Importado do expo-image
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  metaInfo?: string;
  onPress?: () => void; // 3. Adicionada a prop onPress
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  description,
  thumbnailUrl,
  metaInfo,
  onPress,
}) => {
  const [imageError, setImageError] = useState(false);

  // 1. Efeito para resetar o erro quando a URL muda
  useEffect(() => {
    setImageError(false);
  }, [thumbnailUrl]);

  const showGradient = !thumbnailUrl || imageError;

  return (
    // 3. O Link foi removido daqui. Agora é um TouchableOpacity simples.
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.8}
      // 4. Melhorando a acessibilidade
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${description}`}>
      {showGradient ? (
        <LinearGradient
          colors={["#8A2BE2", "#DDA0DD"]}
          style={styles.gradientPlaceholder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      ) : (
        // 2. Usando o componente Image do expo-image
        <Image
          source={thumbnailUrl} // API mais simples, aceita a string diretamente
          style={styles.thumbnail}
          contentFit="cover"
          accessibilityLabel={`Capa de ${title}`}
          onError={() => setImageError(true)}
          transition={300} // Efeito de fade-in suave ao carregar
        />
      )}
      <View style={styles.contentWrapper}>
        {metaInfo && <Text style={styles.metaInfo}>{metaInfo}</Text>}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.light.textWhite,
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
      },
      android: {
        borderWidth: 1,
        borderColor: "#0000000A",
      },
    }),
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#F0F0F0",
  },
  gradientPlaceholder: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 21,
  },
  metaInfo: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
});

export default React.memo(ContentCard);
