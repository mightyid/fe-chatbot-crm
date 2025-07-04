import vi from '~/locales/vi.json'
import en from '~/locales/en.json'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    warnHtmlMessage: false,
    messages: {
      en,
      vi,
    },
    fallbackLocale: 'en',
  }
})
