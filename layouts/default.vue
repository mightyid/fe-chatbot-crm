<template>
  <div class="layout-blank">
    <header class="sticky top-0 py-2 px-4 bg-white border-b-1 border-gray-20 border-b-solid z-88">
      <div class="container mx-a">
        <nuxt-link to="/">
          <img src="/images/logo.svg" alt="" />
        </nuxt-link>
      </div>
    </header>
    <slot />
  </div>
</template>
