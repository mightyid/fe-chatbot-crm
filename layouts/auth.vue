<template>
  <div class="layout-auth flex flex-col md:flex-row h-dvh overflow-hidden">
    <div class="md:flex-1 relative bg-[#FAF9FF]">
      <div class="h-full flex flex-col gap-6">
        <div class="p-8">
          <nuxt-link class="block" to="/">
            <img class="max-w-[196px]" src="/images/logo.svg" alt="" />
          </nuxt-link>
        </div>

        <div class="hidden md:flex md:p-16 md:pt-0 flex-1 items-center justify-center">
          <div class="relative">
            <img class="relative max-w-[100%] z-2" src="/images/main-auth.png" alt="" />

            <div class="absolute bottom-[-20%] left-[-15%] z-0">
              <img src="/images/auth-bg.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="md:basis-[40%] md:h-dvh flex flex-col justify-center">
      <div class="p-8 overflow-auto">
        <slot />
      </div>
    </div>
    <ConfirmDialog />
    <Toast />
  </div>
</template>
