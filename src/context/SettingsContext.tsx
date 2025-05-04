
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useNotificationSound } from "@/hooks/use-notification-sound";

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
  autoLock: boolean;
  desktopNotifications: boolean;
  dataCollection: boolean;
  volume: number;
  lastUpdated?: string;
}

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  hasChanges: boolean;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
  // Convenience functions
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
  autoLock: true,
  desktopNotifications: true,
  dataCollection: false,
  volume: 70,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: false,
  hasChanges: false,
  updateSetting: () => {},
  saveSettings: async () => {},
  resetSettings: async () => {},
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
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { playSound } = useNotificationSound();
  
  // Check if any settings have been changed
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("settings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings) as Settings;
          setSettings(parsedSettings);
          setOriginalSettings(parsedSettings);
        } else {
          // Set the preferred color scheme from the OS if no saved setting
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          const initialSettings = {
            ...defaultSettings,
            theme: prefersDark ? "dark" : "light"
          };
          setSettings(initialSettings);
          setOriginalSettings(initialSettings);
          localStorage.setItem("settings", JSON.stringify(initialSettings));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          title: "Error loading settings",
          description: "Your settings could not be loaded. Default settings will be used.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    // Apply theme to the body
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply font size to the root element
    const rootElement = document.documentElement;
    switch (settings.fontSize) {
      case "small":
        rootElement.style.fontSize = "0.875rem";
        break;
      case "medium":
        rootElement.style.fontSize = "1rem";
        break;
      case "large":
        rootElement.style.fontSize = "1.125rem";
        break;
      default:
        rootElement.style.fontSize = "1rem";
    }

    // Additional effects for other settings can be added here
  }, [settings.theme, settings.fontSize]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Update timestamp
      const updatedSettings = {
        ...settings,
        lastUpdated: new Date().toISOString()
      };
      
      // In a real app, you might save to an API here
      // For now, we'll just use localStorage
      localStorage.setItem("settings", JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      setOriginalSettings(updatedSettings);
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been saved successfully.",
        variant: "default"
      });
      
      if (settings.soundEnabled) {
        playSound('success');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error saving settings",
        description: "Your settings could not be saved. Please try again.",
        variant: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, you might reset from an API here
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
      setOriginalSettings(defaultSettings);
      
      toast({
        title: "Settings reset",
        description: "All settings have been reset to their default values.",
        variant: "default"
      });
      
      if (settings.soundEnabled) {
        playSound('alert');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to reset settings:", error);
      toast({
        title: "Error resetting settings",
        description: "Your settings could not be reset. Please try again.",
        variant: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convenience methods for commonly used settings
  const toggleTheme = () => {
    updateSetting("theme", settings.theme === "light" ? "dark" : "light");
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
      isLoading,
      hasChanges,
      updateSetting,
      saveSettings,
      resetSettings,
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

export default SettingsProvider;
