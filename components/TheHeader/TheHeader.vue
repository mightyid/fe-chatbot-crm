<script setup lang="ts">
import { type LocaleType } from '~/types'
import { useAppStore } from '~/stores/app'
import { VI_LOCALE_CALENDAR } from '~/constant/primevueConfigLocaleCalendar'
// import { cloneDeep } from 'lodash'
import TheHeaderUser from './TheHeaderUser.vue'
import TheHeaderNotifications from './Notifications/TheHeaderNotifications.vue'

type LangItemType = {
  name: string
  value: LocaleType
}

const { $moment } = useNuxtApp()
const appStore = useAppStore()
const { setLocale, locale } = useI18n()
const primevue = usePrimeVue()

const selectLang = ref<LocaleType>(appStore.locale)
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
const configlocaleDefault = ref<any>({})

// configlocaleDefault.value = cloneDeep(primevue.config.locale) // Save default locale

const changeTextByLocale = (newValue: string) => {
  if (primevue.config.locale) {
    if (newValue === 'vi') {
      primevue.config.locale = { ...primevue.config.locale, ...VI_LOCALE_CALENDAR }
    } else {
      // primevue.config.locale = cloneDeep(configlocaleDefault.value)
    }
  }
}
changeTextByLocale(locale.value)

watch(
  () => selectLang.value,
  (newValue) => {
    if (newValue) {
      setLocale(newValue)
      // appStore.updateLocale(newValue)

      // Set locale for primevue
      changeTextByLocale(newValue)

      // Set locale for moment
      // $moment.locale(newValue)
    }
  },
)
</script>

<template>
  <div class="sticky top-0 py-[12px] px-[24px] bg-white border-b-1 border-gray-20 border-b-solid z-2">
    <div class="flex items-center justify-end gap-6">
      <!-- <Dropdown v-model="selectLang" :options="langOptions" optionValue="value" class="px-1">
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
      </Dropdown> -->

      <!-- <TheHeaderNotifications /> -->

      <TheHeaderUser />
    </div>
  </div>
</template>
