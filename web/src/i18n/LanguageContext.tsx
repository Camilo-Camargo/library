import { createContext, useContext, useState, ReactNode } from "react";
import { EN, ES } from "./languages";

type Language = typeof EN;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: "EN" | "ES") => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(ES);

  const setLanguage = (lang: "EN" | "ES") => {
    setLanguageState(lang === "EN" ? EN : ES);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
