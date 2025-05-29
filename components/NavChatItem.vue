<script lang="ts" setup>
const props = defineProps({
  info: {
    type: Object,
    default: {},
  },
})
</script>

<template>
  <nuxt-link :to="`/chat/${info?._id}`" class="fc flex px-2 bg-white py-2 hover:bg-b-1">
    <div class="fr ai-c gap-4">
      <BaseAvatar :size="32" :url="info?.bot?.avatar" />
      <div class="fc">
        <div class="text-base font-semibold c-black-90 capitalize">{{ info?.name }}</div>
        <div class="text-xs font-normal c-black-60">
          {{ useMoment(info?.updated_at) }}
        </div>
      </div>
    </div>
  </nuxt-link>
</template>
<style scoped lang="scss">
.router-link-active.router-link-exact-active {
  background-color: #f6f6f7;
}
</style>
