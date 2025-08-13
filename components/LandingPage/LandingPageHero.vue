<script lang="ts" setup>
const { t } = useI18n()
</script>
<template>
  <section class="hero py-10 px-4 bg-cover bg-no-repeat lg:py-40">
    <div class="container mx-auto">
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-10" data-aos="fade-right">
        <div class="flex-1">
          <h3 class="text-label text-center lt-lg:mx-a mt-0 !mb-5">
            {{ t('home.MỘT NỀN TẢNG - ĐA KÊNH - TỐI ĐA HIỆU QUẢ TUYỂN SINH') }}
          </h3>

          <h1 class="mt-0 mb-4 text-heading"> {{ t('home.Tối Ưu Tuyển Sinh - Vận Hành Đa Kênh Hiệu Quả') }} </h1>
          <p class="mt-0 mb-4 text-paragraph text-center lg:text-left">
            {{ t('home.Chọn giải pháp phù hợp với mọi quy mô trung tâm và trường học') }}
          </p>

          <Button class="block mx-auto" :label="t('home.Bắt đầu ngay')" severity="primary" type="button" />
        </div>

        <div class="flex-1" data-aos="fade-left">
          <img class="block max-w-full mx-auto" src="~/assets/images/landing-page/hero-image.svg" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  background-image: url('~/assets/images/landing-page/hero-bg.svg');
}
</style>
