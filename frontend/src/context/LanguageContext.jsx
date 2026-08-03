import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation object for supported languages
const translations = {
  en: {
    // Settings Page
    settings: "Settings",
    settingsDesc: "Manage appearance, notifications, security, AI behavior, and regional preferences from one polished control center.",
    saveChanges: "Save Changes",
    general: "General",
    appearance: "Appearance",
    notifications: "Notifications",
    security: "Security",
    aiPreferences: "AI Preferences",
    dataPrivacy: "Data & Privacy",
    about: "About",
    
    // Appearance Section
    appearanceTitle: "APPEARANCE",
    appearanceSubtitle: "Customize the application look and feel.",
    appearance: "Appearance",
    appearanceDesc: "Customize the application look and feel.",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    accentColor: "ACCENT COLOR",
    accentColorSubtitle: "Choose your preferred primary color.",
    accentColorDesc: "Choose your preferred primary color.",
    displaySettings: "DISPLAY SETTINGS",
    displaySettingsSubtitle: "Customize interface behavior and accessibility.",
    displaySettingsDesc: "Customize interface behavior and accessibility.",
    compactMode: "Compact Mode",
    compactModeDesc: "Reduce spacing and component size.",
    enableAnimations: "Enable Animations",
    enableAnimationsDesc: "Smooth transitions and page animations.",
    glassEffect: "Glass Effect",
    glassEffectDesc: "Enable blur and glassmorphism effects.",
    roundedComponents: "Rounded Components",
    roundedComponentsDesc: "Increase border radius throughout the app.",
    fontSize: "Font Size",
    fontSizeDesc: "Choose application text size.",
    small: "Small",
    medium: "Medium",
    large: "Large",
    uiDensity: "UI Density",
    uiDensityDesc: "Control spacing between elements.",
    compact: "Compact",
    comfortable: "Comfortable",
    spacious: "Spacious",
    livePreview: "LIVE PREVIEW",
    livePreviewSubtitle: "Preview current appearance settings.",
    livePreviewDesc: "Preview current appearance settings.",
    smartRetailDashboard: "Smart Retail Dashboard",
    previewUpdates: "This preview updates according to your selected appearance settings.",
    primaryButton: "Primary Button",
    secondary: "Secondary",
    
    // General Section
    generalSettings: "GENERAL SETTINGS",
    generalSubtitle: "Manage your store information and regional preferences.",
    storeName: "Store Name",
    storeNameDesc: "Displayed across reports, invoices and receipts.",
    timezone: "Timezone",
    timezoneDesc: "Used for scheduling and report generation.",
    currency: "Currency",
    currencyDesc: "Default currency used throughout the application.",
    dateFormat: "Date Format",
    dateFormatDesc: "Preferred format for reports and analytics.",
    language: "Language",
    languageDesc: "Choose your preferred application language.",
    storeContact: "STORE CONTACT INFORMATION",
    storeContactDesc: "Business communication details",
    phoneNumber: "Phone Number",
    phoneNumberDesc: "Primary contact number",
    businessEmail: "Business Email",
    businessEmailDesc: "Official communication email",
    fullAddress: "Full Address",
    fullAddressDesc: "Complete business address",
    configStatus: "CURRENT CONFIGURATION STATUS",
    configStatusDesc: "Quick overview of active settings",
    
    // Notification Section
    notificationPreferences: "NOTIFICATION PREFERENCES",
    notificationPreferencesSubtitle: "Choose which notifications you would like to receive.",
    emailNotifications: "Email Notifications",
    emailNotificationsDesc: "Receive important updates via email.",
    pushNotifications: "Push Notifications",
    pushNotificationsDesc: "Browser and mobile notifications.",
    lowStockAlerts: "Low Stock Alerts",
    lowStockAlertsDesc: "Notify when products reach minimum quantity.",
    aiRecommendations: "AI Recommendations",
    aiRecommendationsDesc: "Receive AI-powered business suggestions.",
    dailySalesReports: "Daily Sales Reports",
    dailySalesReportsDesc: "Automatic sales summary every day.",
    weeklySummary: "Weekly Summary",
    weeklySummaryDesc: "Receive a weekly business overview.",
    emailFrequency: "EMAIL FREQUENCY",
    emailFrequencySubtitle: "Control how often reports are delivered.",
    reportFrequency: "Report Frequency",
    reportFrequencyDesc: "Select how often reports are emailed.",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    marketingEmails: "Marketing Emails",
    marketingEmailsDesc: "Receive product news and feature updates.",
    soundDesktopAlerts: "SOUND & DESKTOP ALERTS",
    soundDesktopAlertsSubtitle: "Customize desktop notification behavior.",
    notificationSound: "Notification Sound",
    notificationSoundDesc: "Play sound when a notification arrives.",
    desktopAlerts: "Desktop Alerts",
    desktopAlertsDesc: "Show browser desktop notifications.",
    criticalAlerts: "Critical Alerts",
    criticalAlertsDesc: "Always notify for important events.",
    liveStatus: "LIVE STATUS",
    liveStatusSubtitle: "Current notification system status.",
    emailService: "Email Service : Online",
    pushService: "Push Service : Active",
    aiAlertEngine: "AI Alert Engine : Connected",
    
    // Security Section
    authentication: "AUTHENTICATION",
    authenticationSubtitle: "Manage login and account security.",
    twoFactorAuth: "Two-Factor Authentication",
    twoFactorAuthDesc: "Require OTP verification during login.",
    sessionTimeout: "Session Timeout",
    sessionTimeoutDesc: "Automatically logout after inactivity.",
    password: "PASSWORD",
    passwordSubtitle: "Keep your account protected.",
    changePassword: "Change Password",
    passwordDesc: "Last changed 12 days ago.",
    loginDevices: "LOGIN DEVICES",
    loginDevicesSubtitle: "Manage trusted devices.",
    currentDevice: "Current Device",
    revoke: "Revoke",
    accountSecurity: "ACCOUNT SECURITY",
    accountSecuritySubtitle: "Additional security controls.",
    loginAlerts: "Login Alerts",
    loginAlertsDesc: "Receive alerts for new logins.",
    rememberDevices: "Remember Devices",
    rememberDevicesDesc: "Skip OTP on trusted devices.",
    logoutAllDevices: "Logout From All Devices",
    logoutAllDevicesDesc: "End all active sessions immediately.",
    logoutAll: "Logout All",
    securityStatus: "SECURITY STATUS",
    securityStatusSubtitle: "Overall account protection.",
    accountProtected: "Account Protected",
    databaseEncrypted: "Database Encrypted",
    lastLogin: "Last Login : Today 09:14 AM",
    
    // Navigation
    dashboard: "Dashboard",
    products: "Products",
    inventory: "Inventory",
    sales: "Sales",
    forecasting: "Forecasting",
    reports: "Reports",
    aiStoreManager: "AI Store Manager",
    logout: "Logout",
  },
  hi: {
    // Settings Page
    settings: "सेटिंग्स",
    settingsDesc: "एक पॉलिश किए गए नियंत्रण केंद्र से दिखावट, सूचनाएं, सुरक्षा, AI व्यवहार और क्षेत्रीय वरीयताओं को प्रबंधित करें।",
    saveChanges: "परिवर्तन सहेजें",
    general: "सामान्य",
    appearance: "दिखावट",
    notifications: "सूचनाएं",
    security: "सुरक्षा",
    aiPreferences: "AI वरीयताएं",
    dataPrivacy: "डेटा और गोपनीयता",
    about: "के बारे में",
    
    // Appearance Section
    appearanceTitle: "दिखावट",
    appearanceSubtitle: "अनुप्रयोग के लुक और फील को अनुकूलित करें।",
    appearance: "दिखावट",
    appearanceDesc: "अनुप्रयोग के लुक और फील को अनुकूलित करें।",
    theme: "थीम",
    light: "हल्का",
    dark: "अंधेरा",
    system: "सिस्टम",
    accentColor: "उच्चारण रंग",
    accentColorSubtitle: "अपना पसंदीदा प्राथमिक रंग चुनें।",
    accentColorDesc: "अपना पसंदीदा प्राथमिक रंग चुनें।",
    displaySettings: "डिस्प्ले सेटिंग्स",
    displaySettingsSubtitle: "इंटरफेस व्यवहार और पहुंच को अनुकूलित करें।",
    displaySettingsDesc: "इंटरफेस व्यवहार और पहुंच को अनुकूलित करें।",
    compactMode: "कॉम्पैक्ट मोड",
    compactModeDesc: "रिक्ति और घटक आकार को कम करें।",
    enableAnimations: "एनिमेशन सक्षम करें",
    enableAnimationsDesc: "चिकनी संक्रमण और पृष्ठ एनिमेशन।",
    glassEffect: "ग्लास प्रभाव",
    glassEffectDesc: "ब्लर और ग्लासमॉर्फिज़्म प्रभाव सक्षम करें।",
    roundedComponents: "गोल घटक",
    roundedComponentsDesc: "पूरे ऐप में सीमान्त त्रिज्या बढ़ाएं।",
    fontSize: "फ़ॉन्ट आकार",
    fontSizeDesc: "अनुप्रयोग पाठ आकार चुनें।",
    small: "छोटा",
    medium: "मध्यम",
    large: "बड़ा",
    uiDensity: "UI घनत्व",
    uiDensityDesc: "तत्वों के बीच रिक्ति नियंत्रित करें।",
    compact: "कॉम्पैक्ट",
    comfortable: "आरामदायक",
    spacious: "विशाल",
    livePreview: "लाइव पूर्वावलोकन",
    livePreviewSubtitle: "वर्तमान दिखावट सेटिंग्स का पूर्वावलोकन करें।",
    livePreviewDesc: "वर्तमान दिखावट सेटिंग्स का पूर्वावलोकन करें।",
    smartRetailDashboard: "स्मार्ट रिटेल डैशबोर्ड",
    previewUpdates: "यह पूर्वावलोकन आपकी चयनित दिखावट सेटिंग्स के अनुसार अपडेट होता है।",
    primaryButton: "प्राथमिक बटन",
    secondary: "माध्यमिक",
    
    // General Section
    generalSettings: "सामान्य सेटिंग्स",
    generalSubtitle: "अपनी स्टोर जानकारी और क्षेत्रीय वरीयताओं को प्रबंधित करें।",
    storeName: "स्टोर का नाम",
    storeNameDesc: "रिपोर्ट, चालान और रसीदों में प्रदर्शित।",
    timezone: "समय क्षेत्र",
    timezoneDesc: "शेड्यूलिंग और रिपोर्ट जनरेशन के लिए उपयोग किया जाता है।",
    currency: "मुद्रा",
    currencyDesc: "पूरे आवेदन में उपयोग की जाने वाली डिफ़ॉल्ट मुद्रा।",
    dateFormat: "तारीख प्रारूप",
    dateFormatDesc: "रिपोर्ट और विश्लेषण के लिए पसंदीदा प्रारूप।",
    language: "भाषा",
    languageDesc: "अपनी पसंदीदा अनुप्रयोग भाषा चुनें।",
    storeContact: "स्टोर संपर्क जानकारी",
    storeContactDesc: "व्यावसायिक संचार विवरण",
    phoneNumber: "फोन नंबर",
    phoneNumberDesc: "प्राथमिक संपर्क नंबर",
    businessEmail: "व्यावसायिक ईमेल",
    businessEmailDesc: "आधिकारिक संचार ईमेल",
    fullAddress: "पूरा पता",
    fullAddressDesc: "संपूर्ण व्यावसायिक पता",
    configStatus: "वर्तमान कॉन्फ़िगरेशन स्थिति",
    configStatusDesc: "सक्रिय सेटिंग्स का त्वरित अवलोकन",
    currencyDesc: "पूरे आवेदन में उपयोग की जाने वाली डिफ़ॉल्ट मुद्रा।",
    dateFormat: "तारीख प्रारूप",
    dateFormatDesc: "रिपोर्ट और विश्लेषण के लिए पसंदीदा प्रारूप।",
    language: "भाषा",
    languageDesc: "अपनी पसंदीदा अनुप्रयोग भाषा चुनें।",
    
    // Notification Section
    notificationPreferences: "सूचना वरीयताएं",
    notificationPreferencesSubtitle: "चुनें कि आप कौन सी सूचनाएं प्राप्त करना चाहते हैं।",
    emailNotifications: "ईमेल सूचनाएं",
    emailNotificationsDesc: "ईमेल के माध्यम से महत्वपूर्ण अपडेट प्राप्त करें।",
    pushNotifications: "पुश सूचनाएं",
    pushNotificationsDesc: "ब्राउज़र और मोबाइल सूचनाएं।",
    lowStockAlerts: "कम स्टॉक अलर्ट",
    lowStockAlertsDesc: "जब उत्पाद न्यूनतम मात्रा तक पहुंचें तो सूचित करें।",
    aiRecommendations: "AI सिफारिशें",
    aiRecommendationsDesc: "AI-संचालित व्यावसायिक सुझाव प्राप्त करें।",
    dailySalesReports: "दैनिक बिक्री रिपोर्ट",
    dailySalesReportsDesc: "हर दिन स्वचालित बिक्री सारांश।",
    weeklySummary: "साप्ताहिक सारांश",
    weeklySummaryDesc: "साप्ताहिक व्यावसायिक अवलोकन प्राप्त करें।",
    emailFrequency: "ईमेल आवृत्ति",
    emailFrequencySubtitle: "नियंत्रित करें कि रिपोर्ट कितनी बार प्रदान की जाती हैं।",
    reportFrequency: "रिपोर्ट आवृत्ति",
    reportFrequencyDesc: "चुनें कि रिपोर्ट कितनी बार ईमेल की जाएं।",
    daily: "दैनिक",
    weekly: "साप्ताहिक",
    monthly: "मासिक",
    marketingEmails: "विपणन ईमेल",
    marketingEmailsDesc: "उत्पाद समाचार और फीचर अपडेट प्राप्त करें।",
    soundDesktopAlerts: "ध्वनि और डेस्कटॉप अलर्ट",
    soundDesktopAlertsSubtitle: "डेस्कटॉप सूचना व्यवहार को अनुकूलित करें।",
    notificationSound: "सूचना ध्वनि",
    notificationSoundDesc: "जब कोई सूचना आए तो ध्वनि चलाएं।",
    desktopAlerts: "डेस्कटॉप अलर्ट",
    desktopAlertsDesc: "ब्राउज़र डेस्कटॉप सूचनाएं दिखाएं।",
    criticalAlerts: "महत्वपूर्ण अलर्ट",
    criticalAlertsDesc: "महत्वपूर्ण घटनाओं के लिए हमेशा सूचित करें।",
    liveStatus: "लाइव स्थिति",
    liveStatusSubtitle: "वर्तमान सूचना प्रणाली स्थिति।",
    emailService: "ईमेल सेवा : ऑनलाइन",
    pushService: "पुश सेवा : सक्रिय",
    aiAlertEngine: "AI अलर्ट इंजन : कनेक्टेड",
    
    // Security Section
    authentication: "प्रमाणीकरण",
    authenticationSubtitle: "लॉगिन और खाता सुरक्षा प्रबंधित करें।",
    twoFactorAuth: "दो-कारक प्रमाणीकरण",
    twoFactorAuthDesc: "लॉगिन के दौरान OTP सत्यापन की आवश्यकता है।",
    sessionTimeout: "सत्र समय सीमा",
    sessionTimeoutDesc: "निष्क्रियता के बाद स्वचालित रूप से लॉगआउट करें।",
    password: "पासवर्ड",
    passwordSubtitle: "अपने खाते को सुरक्षित रखें।",
    changePassword: "पासवर्ड बदलें",
    passwordDesc: "12 दिन पहले बदला गया।",
    loginDevices: "लॉगिन डिवाइस",
    loginDevicesSubtitle: "विश्वसनीय उपकरणों को प्रबंधित करें।",
    currentDevice: "वर्तमान डिवाइस",
    revoke: "रद्द करें",
    accountSecurity: "खाता सुरक्षा",
    accountSecuritySubtitle: "अतिरिक्त सुरक्षा नियंत्रण।",
    loginAlerts: "लॉगिन अलर्ट",
    loginAlertsDesc: "नए लॉगिन के लिए अलर्ट प्राप्त करें।",
    rememberDevices: "उपकरणों को याद रखें",
    rememberDevicesDesc: "विश्वसनीय उपकरणों पर OTP छोड़ें।",
    logoutAllDevices: "सभी डिवाइस से लॉगआउट करें",
    logoutAllDevicesDesc: "सभी सक्रिय सत्र तुरंत समाप्त करें।",
    logoutAll: "सभी को लॉगआउट करें",
    securityStatus: "सुरक्षा स्थिति",
    securityStatusSubtitle: "समग्र खाता संरक्षण।",
    accountProtected: "खाता सुरक्षित",
    databaseEncrypted: "डेटाबेस एन्क्रिप्ट किया गया",
    lastLogin: "अंतिम लॉगिन : आज 09:14 AM",
    
    // Navigation
    dashboard: "डैशबोर्ड",
    products: "उत्पाद",
    inventory: "सूची",
    sales: "बिक्री",
    forecasting: "पूर्वानुमान",
    reports: "रिपोर्ट",
    aiStoreManager: "AI स्टोर प्रबंधक",
    logout: "लॉग आउट",
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    try {
      const saved = localStorage.getItem("app_language");
      return saved || "en";
    } catch (e) {
      return "en";
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_language", currentLanguage);
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || translations.en[key] || key;
  };

  const switchLanguage = (lang) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ t, currentLanguage, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
