import { createTheme } from "@mui/material/styles";

const createAppTheme = (mode = "light", options = {}) => {
  const accent = options.accent || "#4F46E5";
  const radius = options.radius ?? 20;
  return createTheme({
    palette: {
      mode,

      primary: {
        main: accent,
        light: "#818CF8",
        dark: "#3730A3",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: "#06B6D4",
        light: "#67E8F9",
        dark: "#0E7490",
        contrastText: "#FFFFFF",
      },

      success: {
        main: "#22C55E",
      },

      warning: {
        main: "#F59E0B",
      },

      error: {
        main: "#EF4444",
      },

      background: {
        default: mode === "dark" ? "#0B1120" : "#F8FAFC",
        paper: mode === "dark" ? "#111827" : "#FFFFFF",
      },

      text: {
        primary: mode === "dark" ? "#F8FAF8" : "#0F172A",
        secondary: mode === "dark" ? "#CBD5E1" : "#64748B",
      },

      divider: mode === "dark" ? "#374151" : "#E2E8F0",
    },

    shape: {
      borderRadius: radius,
    },

    typography: {
      fontFamily: [
        "Inter",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ].join(","),

      h1: {
        fontWeight: 800,
        fontSize: "3.5rem",
        letterSpacing: "-2px",
        lineHeight: 1.1,
      },

      h2: {
        fontWeight: 800,
        fontSize: "3rem",
        letterSpacing: "-1.5px",
        lineHeight: 1.1,
      },

      h3: {
        fontWeight: 800,
        lineHeight: 1.15,
      },

      h4: {
        fontWeight: 700,
        lineHeight: 1.2,
      },

      h5: {
        fontWeight: 700,
        lineHeight: 1.25,
      },

      h6: {
        fontWeight: 700,
        lineHeight: 1.3,
      },

      subtitle1: {
        fontWeight: 600,
      },

      subtitle2: {
        fontWeight: 600,
      },

      body1: {
        lineHeight: 1.7,
      },

      body2: {
        lineHeight: 1.6,
      },

      button: {
        textTransform: "none",
        fontWeight: 700,
        letterSpacing: "0.2px",
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollBehavior: "smooth",
          },

          body: {
            margin: 0,
            padding: 0,
            overflowX: "hidden",
            backgroundColor: mode === "dark" ? "#0B1120" : "#F8FAFC",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },

          "*": {
            boxSizing: "border-box",
          },

          a: {
            textDecoration: "none",
            color: "inherit",
          },

          "::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },

          "::-webkit-scrollbar-thumb": {
            background: mode === "dark" ? "#4B5563" : "#CBD5E1",
            borderRadius: "999px",
          },

          "::-webkit-scrollbar-thumb:hover": {
            background: mode === "dark" ? "#6B7280" : "#94A3B8",
          },
        },
      },

          MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 52,
            borderRadius: 14,
            fontWeight: 700,
            transition: "all .25s ease",
          },
              contained: {
            background: `linear-gradient(135deg, ${accent} 0%, #6366F1 100%)`,
            boxShadow: `0 10px 25px rgba(79,70,229,.25)`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 18px 35px rgba(79,70,229,.30)",
            },
          },

          outlined: {
            borderWidth: "1.5px",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 24,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            overflow: "hidden",
            border: mode === "dark" ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(226,232,240,.7)",
            boxShadow: mode === "dark" ? "0 10px 35px rgba(0,0,0,.35)" : "0 10px 35px rgba(15,23,42,.06)",
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: mode === "dark" ? "0 18px 45px rgba(0,0,0,.45)" : "0 18px 45px rgba(15,23,42,.10)",
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: mode === "dark" ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.95)",
            transition: "all .25s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "dark" ? "#374151" : "#E2E8F0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6366F1",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4F46E5",
              borderWidth: "2px",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 4px rgba(79,70,229,.12)",
            },
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          fullWidth: true,
          variant: "outlined",
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === "dark" ? "rgba(15,23,42,.92)" : "rgba(255,255,255,.85)",
            backdropFilter: "blur(18px)",
            color: mode === "dark" ? "#E5E7EB" : "#0F172A",
            borderBottom: mode === "dark" ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(226,232,240,.7)",
            boxShadow: mode === "dark" ? "0 2px 10px rgba(0,0,0,.35)" : "0 2px 10px rgba(15,23,42,.04)",
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: mode === "dark" ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(226,232,240,.8)",
            background: mode === "dark" ? "rgba(15,23,42,.95)" : "rgba(255,255,255,.95)",
            backdropFilter: "blur(18px)",
          },
        },
      },

      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 18,
          },
        },
      },
    },
  });
};

export default createAppTheme;