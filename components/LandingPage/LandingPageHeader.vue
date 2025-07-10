<script setup lang="ts">
import { VI_LOCALE_CALENDAR } from '~/constant/primevueConfigLocaleCalendar'
import type { LocaleType } from '~/types'

const isShowMenuMobile = ref(false)
const appStore = useAppStore()
const { t } = useI18n()
type LangItemType = {
  name: string
  value: LocaleType
}
const { setLocale, locale } = useI18n()
const selectLang = ref<any>(appStore.locale)
const langOptions = ref<LangItemType[]>([
  {
    name: '',
    value: 'vi',
  },
  {
    name: '',
    value: 'en',
  },
])
const toggleMenuMobile = () => {
  isShowMenuMobile.value = !isShowMenuMobile.value
}
const primevue = usePrimeVue()

const changeTextByLocale = (newValue: string) => {
  if (primevue.config.locale) {
    if (newValue === 'vi') {
      primevue.config.locale = { ...primevue.config.locale, ...VI_LOCALE_CALENDAR }
    } else {
      // primevue.config.locale = cloneDeep(configlocaleDefault.value)
    }
  }
}
changeTextByLocale(selectLang.value)
setLocale(selectLang.value)
watch(
  () => selectLang.value,
  (newValue) => {
    if (newValue) {
      setLocale(newValue)
      appStore.locale = newValue

      // Set locale for primevue
      changeTextByLocale(newValue)

      // Set locale for moment
      // $moment.locale(newValue)
    }
  },
)
</script>

<template>
  <header class="sticky top-0 py-3 px-4 bg-white border-b border-b-solid border-[#ECE9DF] z-91">
    <div class="container mx-auto">
      <nav class="flex items-center justify-between gap-4">
        <nuxt-link to="/">
          <img class="h-[48px]" src="~/assets/images/logo.svg" alt="" />
        </nuxt-link>
        <div class="fr ai-c gap-4">
          <div
            class="p-4 fixed top-0 bottom-0 left-0 translate-x-[-100%] flex flex-col gap-4 bg-white overflow-auto transition-all z-99 lg:static lg:translate-x-0 lg:p-0 lg:flex-row lg:items-center lg:overflow-unset"
            :class="isShowMenuMobile ? ['translate-x-0'] : ['']"
          >
            <a class="text-base font-normal c-primary" href="tel:(+84) 78 555 2875"> Hotline: (+84) 78 555 2875</a>
            <nuxt-link to="/sign-in">
              <Button severity="primary" type="button"> {{ t('common.login') }} </Button>
            </nuxt-link>
          </div>

          <!-- Icon menu mobile -->
          <button class="p-0 lg:hidden" type="button" @click="toggleMenuMobile">
            <img src="~/assets/icons/i-menu-bar.svg" alt="" />
          </button>

          <!-- Mobile overlay -->
          <div
            class="hidden fixed inset-0 bg-black/20 z-98 !lg:hidden"
            :class="isShowMenuMobile ? ['!block'] : ['']"
            @click="toggleMenuMobile"
          >
          </div>
          <Dropdown v-model="selectLang" :options="langOptions" optionValue="value" class="px-1">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center">
                <img class="icon" src="~/assets/icons/i-flag-vi.svg" v-if="slotProps?.value === 'vi'" />
                <img class="icon" src="~/assets/icons/i-flag-en.svg" v-else />
              </div>
            </template>

            <template #option="slotProps">
              <div class="flex items-center">
                <img class="icon" src="~/assets/icons/i-flag-vi.svg" v-if="slotProps?.option?.value === 'vi'" />
                <img class="icon" src="~/assets/icons/i-flag-en.svg" v-else />
              </div>
            </template>
          </Dropdown>
        </div>
      </nav>
    </div>
  </header>
</template>
