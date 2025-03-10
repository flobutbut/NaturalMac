import { createI18n } from 'vue-i18n'
import fr from './locales/fr'

export default createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr
  }
}) 