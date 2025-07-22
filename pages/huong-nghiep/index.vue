<script lang="ts" setup>
import BotHuongNghiep from '~/components/huong-nghiep/BotHuongNghiep.vue'
import ComHero from '~/components/huong-nghiep/ComHero.vue'
definePageMeta({
  auth: false,
  layout: 'blank',
})
</script>

<template>
  <div class="fc">
    <ComHero />
    <BotHuongNghiep />
  </div>
</template>
