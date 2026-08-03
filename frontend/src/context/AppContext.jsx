import React, { createContext, useContext, useState, useEffect } from 'react';
import { useThemeContext } from './ThemeContext'; // If you want to sync theme too

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Load from localStorage on initial render
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : {
      language: 'en',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timezone: 'Asia/Kolkata',
      storeName: 'City SuperMart',
      // Add more global settings as needed
    };
  });

  const { setThemeMode } = useThemeContext(); // Sync with your existing ThemeContext

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  // Change Language (you can integrate i18next here later)
  const changeLanguage = (newLang) => {
    setSettings(prev => ({ ...prev, language: newLang }));
    console.log(`🌐 App language changed to: ${newLang}`);
    // TODO: Integrate with i18next → i18n.changeLanguage(newLang);
  };

  // Change Currency
  const changeCurrency = (newCurrency) => {
    setSettings(prev => ({ ...prev, currency: newCurrency }));
    console.log(`💱 Currency changed to: ${newCurrency}`);
  };

  // Change Date Format
  const changeDateFormat = (newFormat) => {
    setSettings(prev => ({ ...prev, dateFormat: newFormat }));
  };

  // Update multiple settings at once
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    settings,
    changeLanguage,
    changeCurrency,
    changeDateFormat,
    updateSettings,
    // Helper getters
    currentLanguage: settings.language,
    currentCurrency: settings.currency,
    currentDateFormat: settings.dateFormat,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};