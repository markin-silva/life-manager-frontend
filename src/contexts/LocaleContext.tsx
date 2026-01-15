import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { translations, type Locale } from '../i18n/translations';

const STORAGE_KEY = 'locale';
const supportedLocales: Locale[] = ['en', 'pt-BR'];

const getDefaultLocale = (): Locale => {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && supportedLocales.includes(stored)) {
    return stored;
  }

  const browser = navigator.language;
  if (browser.startsWith('pt')) return 'pt-BR';
  return 'en';
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getDefaultLocale);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem(STORAGE_KEY, nextLocale);
  };

  const t = useMemo(() => {
    return (key: string) => {
      const parts = key.split('.');
      let current: any = translations[locale];
      for (const part of parts) {
        current = current?.[part];
      }
      return typeof current === 'string' ? current : key;
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}
