
import React, { createContext, useState, useContext, useEffect } from "react";

interface Settings {
  theme: "light" | "dark";
  language: string;
  currency: string;
  isMoneyHidden: boolean;
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  lowStockThreshold: number;
  fontSize: "small" | "medium" | "large";
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings | null;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  // Added properties that were missing and causing errors
  theme: "light" | "dark";
  toggleTheme: () => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  isMoneyHidden: boolean;
  toggleMoneyVisibility: () => void;
  soundEnabled: boolean;
  toggleSoundEnabled: () => void;
  animationsEnabled: boolean;
  toggleAnimationsEnabled: () => void;
}

const defaultSettings: Settings = {
  theme: "light",
  language: "en",
  currency: "PKR",
  isMoneyHidden: false,
  companyName: "Subhan Computer",
  companyAddress: "Your Address, City, Country",
  companyPhone: "+92-000-0000000",
  companyEmail: "info@example.com",
  lowStockThreshold: 5,
  fontSize: "medium",
  soundEnabled: true,
  animationsEnabled: true,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
  theme: "light",
  toggleTheme: () => {},
  fontSize: "medium",
  setFontSize: () => {},
  isMoneyHidden: false,
  toggleMoneyVisibility: () => {},
  soundEnabled: true,
  toggleSoundEnabled: () => {},
  animationsEnabled: true,
  toggleAnimationsEnabled: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
    
    // Apply theme to the body
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Add convenience methods for commonly used settings
  const toggleTheme = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    updateSetting("theme", newTheme);
  };

  const setFontSize = (size: "small" | "medium" | "large") => {
    updateSetting("fontSize", size);
  };

  const toggleMoneyVisibility = () => {
    updateSetting("isMoneyHidden", !settings.isMoneyHidden);
  };

  const toggleSoundEnabled = () => {
    updateSetting("soundEnabled", !settings.soundEnabled);
  };

  const toggleAnimationsEnabled = () => {
    updateSetting("animationsEnabled", !settings.animationsEnabled);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting,
      theme: settings.theme,
      toggleTheme,
      fontSize: settings.fontSize,
      setFontSize,
      isMoneyHidden: settings.isMoneyHidden,
      toggleMoneyVisibility,
      soundEnabled: settings.soundEnabled,
      toggleSoundEnabled,
      animationsEnabled: settings.animationsEnabled,
      toggleAnimationsEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
