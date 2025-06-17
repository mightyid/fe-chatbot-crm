<script setup lang="ts">
import LandingPageChatbot from '~/components/LandingPage/LandingPageChatbot.vue'
import LandingPageCrm from '~/components/LandingPage/LandingPageCrm.vue'
import LandingPageHero from '~/components/LandingPage/LandingPageHero.vue'
import LandingPageSmartApply from '~/components/LandingPage/LandingPageSmartApply.vue'
import LandingPageWebhook from '~/components/LandingPage/LandingPageWebhook.vue'

definePageMeta({
  layout: 'landing-page',
  auth: false,
})
</script>

<template>
  <LandingPageHero />
  <LandingPageChatbot />
  <LandingPageCrm />
  <LandingPageSmartApply />
  <LandingPageWebhook />
</template>
