import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBRTranslations from '../../modules/Tuner/translations/pt-BR.json';
import enTranslations from '../../modules/Tuner/translations/en.json';

const resources = {
  'pt-BR': {
    translation: ptBRTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // Idioma padrão Português do Brasil
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React já escapa valores contra XSS
    },
  });

export default i18n;
