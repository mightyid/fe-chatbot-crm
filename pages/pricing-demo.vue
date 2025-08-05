<template>
  <div>
    <div class="p-4 bg-gray-100 mb-4">
      <h1 class="text-2xl font-bold mb-4">Pricing Component Demo</h1>
      <div class="flex gap-4 mb-4">
        <button 
          @click="setLanguage('vi')" 
          class="px-4 py-2 bg-blue-500 text-white rounded"
          :class="{ 'bg-blue-700': currentLocale === 'vi' }"
        >
          Tiếng Việt
        </button>
        <button 
          @click="setLanguage('en')" 
          class="px-4 py-2 bg-blue-500 text-white rounded"
          :class="{ 'bg-blue-700': currentLocale === 'en' }"
        >
          English
        </button>
      </div>
      <p class="text-sm text-gray-600">Current language: {{ currentLocale }}</p>
    </div>
    
    <LandingPagePricing />
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)

const setLanguage = (lang: string) => {
  setLocale(lang)
}
</script>
