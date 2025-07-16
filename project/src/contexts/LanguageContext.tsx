import React, { createContext, useContext, useState, ReactNode } from "react";

export type LanguageType =
  | "en"
  | "fr"
  | "es"
  | "pt"
  | "da"
  | "nl"
  | "ru"
  | "ar"
  | "zh"
  | "ko";

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  // Get initial language preference from localStorage or browser language
  const getInitialLanguage = (): LanguageType => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedPreference = window.localStorage.getItem("language");
      if (
        storedPreference &&
        ["en", "fr", "es", "pt", "da", "nl", "ru", "ar", "zh", "ko"].includes(
          storedPreference
        )
      ) {
        return storedPreference as LanguageType;
      }
    }

    // Use browser language if available
    const browserLang = navigator.language.split("-")[0];
    if (
      ["en", "fr", "es", "pt", "da", "nl", "ru", "ar", "zh", "ko"].includes(
        browserLang
      )
    ) {
      return browserLang as LanguageType;
    }

    return "en"; // Default language
  };

  const [language, setLanguageState] =
    useState<LanguageType>(getInitialLanguage);

  const setLanguage = (lang: string) => {
    // Only allow supported languages
    const supported: LanguageType[] = [
      "en",
      "fr",
      "es",
      "pt",
      "da",
      "nl",
      "ru",
      "ar",
      "zh",
      "ko",
    ];
    const safeLang = supported.includes(lang as LanguageType)
      ? (lang as LanguageType)
      : "en";
    setLanguageState(safeLang);
    localStorage.setItem("language", safeLang);
  };

  const value = { language, setLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
