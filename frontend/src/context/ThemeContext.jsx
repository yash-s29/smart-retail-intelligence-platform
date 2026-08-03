import { createContext, useContext, useEffect, useMemo, useState } from "react";
import createAppTheme from "../assets/styles/theme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      // Respect explicit saved choice first
      const saved = localStorage.getItem('app_theme_mode');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // ignore
    }
    // Default to light mode on first load (user can toggle later)
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem("app_theme_mode", themeMode);
  }, [themeMode]);

  const [themeOptions, setThemeOptionsState] = useState(() => {
    try {
      const raw = localStorage.getItem('app_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          accent: parsed.accent || undefined,
          radius: parsed.radius ?? undefined,
        };
      }
    } catch (e) {}
    return { accent: undefined, radius: undefined };
  });

  const setThemeOptions = (opts) => {
    setThemeOptionsState((prev) => {
      const next = { ...prev, ...opts };
      try {
        const raw = localStorage.getItem('app_settings');
        const parsed = raw ? JSON.parse(raw) : {};
        const merged = { ...parsed, ...next };
        localStorage.setItem('app_settings', JSON.stringify(merged));
      } catch (e) {
        console.warn('Unable to persist theme options', e);
      }
      return next;
    });
  };

  const theme = useMemo(() => createAppTheme(themeMode, themeOptions), [themeMode, themeOptions]);

  // Sync a small set of CSS variables for non-MUI styles / raw CSS files
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.setAttribute('data-theme', themeMode);

      root.style.setProperty('--primary', theme.palette.primary.main || '#2563eb');
      root.style.setProperty('--primary-dark', theme.palette.primary.dark || '#1d4ed8');
      root.style.setProperty('--background', theme.palette.background.default || (themeMode === 'dark' ? '#0B1120' : '#F8FAFC'));
      root.style.setProperty('--surface', theme.palette.background.paper || (themeMode === 'dark' ? '#111827' : '#FFFFFF'));
      root.style.setProperty('--text-main', theme.palette.text.primary || (themeMode === 'dark' ? '#F8FAF8' : '#0F172A'));
      root.style.setProperty('--text-secondary', theme.palette.text.secondary || (themeMode === 'dark' ? '#CBD5E1' : '#64748B'));
      root.style.setProperty('--border', theme.palette.divider || (themeMode === 'dark' ? '#374151' : '#E2E8F0'));
    } catch (e) {
      // ignore
    }
  }, [theme, themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme, themeOptions, setThemeOptions }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }
  return context;
}
