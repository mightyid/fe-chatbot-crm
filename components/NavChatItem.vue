<script lang="ts" setup>
const props = defineProps({
  info: {
    type: Object,
    default: {},
  },
})
</script>

<template>
  <nuxt-link :to="`/chat/${info?._id}`" class="fc flex px-2 py-1 hover:bg-b-1">
    <div class="text-base font-semibold c-black-90">{{ info?.name }}</div>
    <div class="text-sm font-normal c-black-60">
      {{ useMoment(info?.updated_at) }}
    </div>
  </nuxt-link>
</template>
