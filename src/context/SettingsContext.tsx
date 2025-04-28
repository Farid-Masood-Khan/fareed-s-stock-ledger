
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";
type FontSize = "small" | "medium" | "large";

interface SettingsContextType {
  theme: Theme;
  fontSize: FontSize;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  isMoneyHidden: boolean;
  toggleMoneyVisibility: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize === "small" || savedFontSize === "medium" || savedFontSize === "large") {
      return savedFontSize;
    }
    return "medium";
  });
  const [isMoneyHidden, setIsMoneyHidden] = useState<boolean>(() => {
    return localStorage.getItem("hideMoneyDetails") === "true";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    const fontSizeClass = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    };
    
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg");
    document.documentElement.classList.add(fontSizeClass[fontSize]);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("hideMoneyDetails", isMoneyHidden.toString());
  }, [isMoneyHidden]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleMoneyVisibility = () => {
    setIsMoneyHidden((prev) => !prev);
  };

  const value = {
    theme,
    fontSize,
    toggleTheme,
    setFontSize,
    isMoneyHidden,
    toggleMoneyVisibility,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
