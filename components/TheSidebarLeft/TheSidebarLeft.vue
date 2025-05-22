<script setup lang="ts">
import TheSidebarLeftNav from './TheSidebarLeftNav.vue'

const isExpand = ref(true)
const isShow = ref(false)

const toggleExpand = () => {
  isExpand.value = !isExpand.value
}

const toggleShow = () => {
  isShow.value = !isShow.value
}
</script>

<template>
  <div
    class="min-w-[295px] h-screen flex flex-col bg-white border-r border-gray-200 transition-all fixed top-0 left-0 -translate-x-full [&.active]:translate-x-0 lg:relative lg:translate-x-0 z-102"
    :class="{ active: isShow }"
    :style="!isExpand ? { minWidth: '92px' } : {}"
  >
    <div class="py-[24px] h-[104px] flex items-center justify-center">
      <nuxt-link to="/">
        <img src="~/assets/images/logo.svg" alt="Logo" v-if="isExpand" class="h-[64px]" />
        <img src="~/assets/images/logo-icon.svg" alt="Logo Short" v-else class="h-[56px]" />
      </nuxt-link>
    </div>

    <TheSidebarLeftNav class="flex-1" :class="[isExpand ? 'w-[295px]' : 'w-[92px]']" :isSidebarCollapse="!isExpand" />

    <button
      class="p-0 hidden lg:block absolute top-[18px] right-0 translate-x-[50%] z-10 cursor-pointer"
      type="button"
      @click="toggleExpand"
    >
      <img
        class="icon transition-all"
        :style="{ transform: !isExpand ? 'rotate(180deg)' : 'rotate(0)' }"
        src="~/assets/icons/i-button-collapse.svg"
        alt="Collapse"
      />
    </button>
  </div>

  <!-- Mobile -->
  <div
    class="fixed top-18 left-16 z-101 lg:hidden cursor-pointer"
    :class="isShow ? 'left-[295px]' : ''"
    @click="toggleShow"
  >
    <img class="icon" src="~/assets/icons/i-menu-bar.svg" alt="Menu" />
  </div>

  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/20 z-100 hidden" :class="{ '!block': isShow }" @click="toggleShow"></div>
</template>

<style lang="scss" scoped>
.active {
  transform: translateX(0);
}

.icon {
  transition: transform 0.3s ease-in-out;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
