<script setup lang="ts">
type LinkItem = {
  icon?: string
  title: string
  to: string
}

defineProps({
  links: {
    type: Array as PropType<LinkItem[]>,
    required: true,
    default: [],
  },
})
</script>

<template>
  <ul class="pl-0 m-0 mb-4 flex items-center">
    <li class="flex items-center" v-for="(item, index) in links" :key="index">
      <img class="w-[14px] h-[14px]" :src="item.icon" alt="" v-if="item.icon" />
      <nuxt-link class="c-black-60 text-s font-normal no-underline" :to="item.to">
        {{ item.title }}
      </nuxt-link>
      <span class="mx-1 c-black-60 font-normal" v-if="index < links?.length - 1"> / </span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.router-link-active.router-link-exact-active {
  color: #002997;
}
</style>
