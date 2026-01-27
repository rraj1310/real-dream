import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark" | "ocean" | "sunset" | "forest";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isPremiumTheme: (theme: Theme) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const premiumThemes: Theme[] = ["ocean", "sunset", "forest"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });

  const isPremiumTheme = (themeToCheck: Theme) => {
    return premiumThemes.includes(themeToCheck);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isPremiumTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
