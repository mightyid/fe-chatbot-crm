<script setup lang="ts">
const isShowMenuMobile = ref(false)

const toggleMenuMobile = () => {
  isShowMenuMobile.value = !isShowMenuMobile.value
}
</script>

<template>
  <header class="sticky top-0 py-3 px-4 bg-white border-b border-b-solid border-[#ECE9DF] z-91">
    <div class="container mx-auto">
      <nav class="flex items-center justify-between gap-4">
        <nuxt-link to="/">
          <img class="h-[48px]" src="~/assets/images/logo.svg" alt="" />
        </nuxt-link>

        <div
          class="p-4 fixed top-0 bottom-0 left-0 translate-x-[-100%] flex flex-col gap-4 bg-white overflow-auto transition-all z-99 lg:static lg:translate-x-0 lg:p-0 lg:flex-row lg:items-center lg:overflow-unset"
          :class="isShowMenuMobile ? ['translate-x-0'] : ['']"
        >
          <a class="text-base font-normal c-primary" href="tel:+84898309509"> Hotline: (+84) 898 309 509 </a>
          <nuxt-link to="/sign-in">
            <Button severity="primary" type="button"> Đăng nhập </Button>
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
        ></div>
      </nav>
    </div>
  </header>
</template>
