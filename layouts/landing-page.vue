<script setup lang="ts">
import LandingPageHeader from '~/components/LandingPage/LandingPageHeader.vue'
import LandingPageFooter from '~/components/LandingPage/LandingPageFooter.vue'
</script>

<template>
  <div class="layout-landing-page">
    <LandingPageHeader />
    <slot></slot>
    <LandingPageFooter />
  </div>
  <ConfirmDialog />
  <Toast />
</template>

<style lang="scss" scoped>
:deep() {
  .text-label {
    width: fit-content;
    padding: 4px 12px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #3abff8;
    background-color: #e7f7fe;
    border-radius: 20px;
  }

  .text-heading {
    font-size: 48px;
    font-weight: 800;
    color: #313131;
  }

  .text-paragraph {
    font-size: 16px;
    line-height: 24px;
    color: #313131;
  }

  @media screen and (max-width: 1023px) {
    .text-heading {
      font-size: 24px;
      line-height: 36px;
      text-align: center;
    }
  }
}
</style>
