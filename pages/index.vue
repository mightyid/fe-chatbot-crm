<script setup lang="ts">
import LandingPageChatbot from '~/components/LandingPage/LandingPageChatbot.vue'
import LandingPageCrm from '~/components/LandingPage/LandingPageCrm.vue'
import LandingPageHero from '~/components/LandingPage/LandingPageHero.vue'
import LandingPagePricing from '~/components/LandingPage/LandingPagePricing.vue'
import LandingPageSmartApply from '~/components/LandingPage/LandingPageSmartApply.vue'
import LandingPageWebhook from '~/components/LandingPage/LandingPageWebhook.vue'

definePageMeta({
  layout: 'landing-page',
  auth: 'guest',
})
</script>

<template>
  <LandingPageHero />
  <LandingPageChatbot />
  <LandingPageCrm />
  <LandingPageSmartApply />
  <LandingPageWebhook />
  <LandingPagePricing />
</template>
