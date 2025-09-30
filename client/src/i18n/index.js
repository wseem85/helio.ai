import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locals/en/common.json';
import arCommon from './locals/ar/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  ar: {
    common: arCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    // Default namespace
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;
