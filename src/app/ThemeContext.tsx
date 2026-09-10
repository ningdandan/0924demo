import { createContext, useContext, useEffect, useState } from "react";
import defaultDt from "./designTokens.json";
import { useDesignTokens } from "./DesignTokensContext";

export interface GradientTheme {
  id: string;
  label: string;
  gradient: string;
  swatchA: string;
  swatchB: string;
  textColor: string;
}

export const THEMES: GradientTheme[] = [
  defaultDt.themes.skyPeriwinkle,
];

interface ThemeContextValue {
  theme: GradientTheme;
  setTheme: (theme: GradientTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { dt } = useDesignTokens();
  const [theme, setTheme] = useState<GradientTheme>(dt.themes.skyPeriwinkle);

  // Keep gradient + textColor in sync when design tokens change
  useEffect(() => {
    setTheme((prev) => ({
      ...prev,
      gradient:  dt.themes.skyPeriwinkle.gradient,
      textColor: dt.themes.skyPeriwinkle.textColor,
      swatchA:   dt.themes.skyPeriwinkle.swatchA,
      swatchB:   dt.themes.skyPeriwinkle.swatchB,
    }));
  }, [dt.themes.skyPeriwinkle]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
