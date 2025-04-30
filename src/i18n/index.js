import { Platform, NativeModules } from "react-native";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "./locales/en";
import amTranslations from "./locales/am";

// Detect device language dynamically
const getDeviceLanguage = () => {
  try {
    const locale =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
        : NativeModules.I18nManager?.localeIdentifier;
    return locale?.startsWith("am") ? "am" : "en";
  } catch (error) {
    //console.warn("Failed to detect device language:", error);
    return "en"; // Fallback to English
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3", // For JSON v3 format compatibility
    resources: {
      en: { translation: enTranslations },
      am: { translation: amTranslations },
    },
    lng: getDeviceLanguage(), // Use device language
    fallbackLng: "en", // Fallback to English
    interpolation: {
      escapeValue: false, // React Native handles escaping
    },
    react: {
      useSuspense: false, // Disable Suspense for React Native
    },
    nsSeparator: "|", // Namespace separator
    keySeparator: ".", // Key separator for nested translations
    parseMissingKeyHandler: (key) => {
      if (__DEV__) {
        //console.warn(`Missing translation: ${key}`);
      }
      return key; // Return key as fallback
    },
    debug: __DEV__, // Enable debug logs in development
  })
  .catch((error) => {
    //console.error("i18n initialization failed:", error);
  });

export default i18n;