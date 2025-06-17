// https://nuxt.com/docs/api/configuration/nuxt-config
//@ts-ignore
const configByEnv = process.env

console.log(configByEnv?.API_URL)
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }],
      title: 'MightyChatbot',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1,maximum-scale=1,user-scalable=0' },
        {
          name: 'description',
          content: 'MightyChatbot',
        },
        { property: 'og:image', content: '/favicon.svg' },
        { property: 'og:title', content: 'MightyChatbot' },
        {
          property: 'og:description',
          content: 'MightyChatbot',
        },
      ],
    },
  },
  components: [
    {
      path: '~/components/common',
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    public: {
      baseURL: configByEnv.BASE_URL,
      apiBase: configByEnv.API_URL,
    },
  },
  css: ['~/assets/styles/scss/styles.scss'],

  modules: [
    'dayjs-nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@vee-validate/nuxt',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-aos',
  ],
  primevue: {
    importTheme: { from: '~/assets/themes/mytheme.js' },
    components: {
      include: [
        'Button',
        'Dialog',
        'Row',
        'Column',
        'ColumnGroup',
        'DataTable',
        'Paginator',
        'InputNumber',
        'Checkbox',
        'RadioButton',
        'DatePicker',
        'Password',
        'Select',
        'MultiSelect',
        'InputText',
        'Textarea',
        'InputSwitch',
        'Toast',
        'ConfirmDialog',
        'ProgressSpinner',
        'TabList',
        'Tab',
        'TabPanel',
        'TabView',
        'Badge',
        'OverlayBadge',
        'VirtualScroller',
        'Popover',
        'TreeSelect',
        'Chart',
      ],
    },
  },
  i18n: {
    vueI18n: '~/utils/i18n.config.ts',
    strategy: 'no_prefix',
  },
  veeValidate: {
    typedSchemaPackage: 'none',
  },

  vite: {
    optimizeDeps: {
      exclude: ['primevue'], // Chặn PrimeVue khỏi quá trình tối ưu hóa để không bị reload trang khi dev
    },
  },

  aos: {
    disable: 'mobile', // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    once: true, // whether animation should happen only once - while scrolling down
    offset: 100,
  },
})
