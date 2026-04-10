import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type LanguageContextType = {
  preferredLang: string;
  setPreferredLang: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferredLang, setPreferredLang] = useState<string>('ca'); // Idioma per defecte complet de l'aplicació

  useEffect(() => {
    // Intentem recuperar l'idioma preferit del localStorage quan s'obre l'app
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) {
      setPreferredLang(savedLang);
    }
  }, []);

  const handleSetLang = (lang: string) => {
    setPreferredLang(lang);
    localStorage.setItem('preferredLang', lang);
  };

  return (
    <LanguageContext.Provider value={{ preferredLang, setPreferredLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
