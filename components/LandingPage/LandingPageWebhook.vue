<script lang="ts" setup>
const { t } = useI18n()
</script>
<template>
  <section class="hero py-10 px-4 bg-cover bg-no-repeat lg:py-20" data-aos="fade-up">
    <div class="container mx-auto">
      <h3 class="mt-0 mb-4 mx-auto text-label"> WEBHOOK </h3>
      <h2 class="mt-0 mb-4 text-heading text-center"> {{ t('home.Real-time data sync with Webhooks') }} </h2>
      <p class="mt-0 mb-12 text-paragraph text-center">
        {{ t('home.Kết nối Webhook để nhận thông báo tức thì từ các nền tảng bên ngoài') }}
      </p>
      <img class="block mx-auto max-w-full" src="~/assets/images/landing-page/webhook.svg" alt="" />
    </div>
  </section>
</template>
