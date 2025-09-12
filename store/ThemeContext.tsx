import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Appearance,
  useColorScheme as useDeviceColorScheme,
} from "react-native";

export type SchemeType = "light" | "dark" | "system";

interface ThemeContextType {
  scheme: SchemeType;
  setScheme: (scheme: SchemeType) => void;
  theme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@user_theme_preference";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceScheme = useDeviceColorScheme();
  const [scheme, setScheme] = useState<SchemeType>("system");

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedScheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedScheme !== null) {
          setScheme(savedScheme as SchemeType);
        }
      } catch (e) {
        console.error("Failed to load theme preference.", e);
      }
    };
    loadThemePreference();
  }, []);

  const handleSetScheme = async (newScheme: SchemeType) => {
    setScheme(newScheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme);
      if (newScheme !== "system") {
        Appearance.setColorScheme(newScheme);
      } else {
        Appearance.setColorScheme(null);
      }
    } catch (e) {
      console.error("Failed to save theme preference.", e);
    }
  };

  const theme = scheme === "system" ? deviceScheme || "light" : scheme;

  return (
    <ThemeContext.Provider
      value={{ scheme, setScheme: handleSetScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
