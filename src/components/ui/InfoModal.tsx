import { useThemeValue } from "@/src/hooks/useThemeValue";
import { Feather } from "@expo/vector-icons";
import React, { ReactNode, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  image?: ImageSourcePropType;
  showDoNotShowAgain?: boolean;
  icon?: ReactNode;
  onDoNotShowAgain?: (value: boolean) => void;
  actions?: ReactNode;
  imageHeight?: number;
  imagemWidth?: number;
}

export const InfoModal = ({
  visible,
  onClose,
  title,
  content,
  image,
  icon,
  showDoNotShowAgain = false,
  actions,
  onDoNotShowAgain,
  imageHeight,
  imagemWidth,
}: InfoModalProps) => {
  const backgroundColor = useThemeValue("card");
  const textColor = useThemeValue("text");
  const secondaryTextColor = useThemeValue("textSecondary");
  const iconColor = useThemeValue("textSecondary");
  const primaryColor = useThemeValue("primary");

  const [isDontShowAgainChecked, setIsDontShowAgainChecked] = useState(false);

  const handleCheckboxToggle = () => {
    const newValue = !isDontShowAgainChecked;
    setIsDontShowAgainChecked(newValue);
    if (onDoNotShowAgain) {
      onDoNotShowAgain(newValue);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x-circle" size={30} color={iconColor} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            {typeof content === "string" ? (
              <Text style={[styles.contentText, { color: secondaryTextColor }]}>
                {content}
              </Text>
            ) : (
              content
            )}
          </ScrollView>
          {image && (
            <View style={[styles.containerImage]}>
              <Image
                source={image}
                style={[
                  styles.modalImage,
                  { height: imageHeight, width: imagemWidth },
                ]}
              />
            </View>
          )}

          {(showDoNotShowAgain || actions) && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={handleCheckboxToggle}>
                <Feather
                  name={isDontShowAgainChecked ? "check-square" : "square"}
                  size={24}
                  color={isDontShowAgainChecked ? primaryColor : iconColor}
                />
                <Text
                  style={[styles.checkboxLabel, { color: secondaryTextColor }]}>
                  Não mostrar novamente
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {actions && <View style={styles.actionsContainer}>{actions}</View>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    height: "80%",
    width: "100%",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 16,
  },
  scrollContentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  containerImage: {
    position: "absolute",
    bottom: 140,
    right: 0,
    left: 0,
  },
  modalImage: {
    resizeMode: "cover",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  actionsContainer: {
    marginTop: 12,
  },
});
