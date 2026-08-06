import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUI from './locales/en.json';
import zhUI from './locales/zh.json';
import esUI from './locales/es.json';
import deUI from './locales/de.json';
import frUI from './locales/fr.json';
import jaUI from './locales/ja.json';
import koUI from './locales/ko.json';

import enScenarios from './scenarios/en.json';
import zhScenarios from './scenarios/zh.json';
import esScenarios from './scenarios/es.json';
import deScenarios from './scenarios/de.json';
import frScenarios from './scenarios/fr.json';
import jaScenarios from './scenarios/ja.json';
import koScenarios from './scenarios/ko.json';

const en = { ...enUI, scenarios: enScenarios };
const zh = { ...zhUI, scenarios: zhScenarios };
const es = { ...esUI, scenarios: esScenarios };
const de = { ...deUI, scenarios: deScenarios };
const fr = { ...frUI, scenarios: frScenarios };
const ja = { ...jaUI, scenarios: jaScenarios };
const ko = { ...koUI, scenarios: koScenarios };

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
] as const;

export const DEFAULT_LANGUAGE = 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      es: { translation: es },
      de: { translation: de },
      fr: { translation: fr },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'tempe_lang',
      caches: ['localStorage'],
    },
    returnNull: false,
  });

// 同步 <html lang> 属性，便于辅助技术与 SEO
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
