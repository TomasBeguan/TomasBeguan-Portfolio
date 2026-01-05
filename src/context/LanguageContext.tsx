"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
    es: {
        about: "Sobre mi",
        portfolio: "Portfolio",
        contact: "Contacto",
        admin: "Admin",
        home: "Inicio",
        back: "Volver",
        diario: "Diario",
        diario_hint: "CLICK EN LAS PÁGINAS PARA PASAR"
    },
    en: {
        about: "About",
        portfolio: "Portfolio",
        contact: "Contact",
        admin: "Admin",
        home: "Home",
        back: "Back",
        diario: "Diary",
        diario_hint: "CLICK ON PAGES TO FLIP"
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en'); // Default to English

    useEffect(() => {
        // Automatic detection logic
        const browserLang = navigator.language;
        if (browserLang.toLowerCase().startsWith('es')) {
            setLanguage('es');
        } else {
            setLanguage('en');
        }
    }, []);

    const t = (key: string) => {
        // Simple translation helper for UI elements
        const dict = translations[language] as Record<string, string>;
        return dict[key.toLowerCase()] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
