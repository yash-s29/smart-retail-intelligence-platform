import "@fontsource/inter";
import React from "react";
import ReactDOM from "react-dom/client";

// Global Redux Provider and Store Connection
import { Provider } from "react-redux";
import store from "./redux/store"; // 🧠 FIXED: Added /redux/ to the path

// Global Styles
import "./assets/styles/variables.css";
import "./assets/styles/global.css";

// App
import App from "./App";

// Contexts
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);