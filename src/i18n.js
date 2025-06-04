import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationRU from './locales/ru/translation.json';

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'ru', // Язык по умолчанию (можно заменить на 'en')
    fallbackLng: 'en', // Резервный язык, если ключа нет
    interpolation: {
      escapeValue: false // React сам экранирует
    }
  });

export default i18n;