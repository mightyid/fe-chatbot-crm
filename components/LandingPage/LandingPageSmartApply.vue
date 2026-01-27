<script setup lang="ts">
import smartapply1 from '~/assets/images/landing-page/smartapply-1.svg'
import smartapply2 from '~/assets/images/landing-page/smartapply-2.svg'
import smartapply3 from '~/assets/images/landing-page/smartapply-3.svg'
import smartapply4 from '~/assets/images/landing-page/smartapply-4.svg'
import smartapply5 from '~/assets/images/landing-page/smartapply-5.svg'
const { t } = useI18n()
const features = computed(() => [
  {
    image: smartapply1,
    title: t('home.Theo dõi hồ sơ online thời gian thực'),
    description: t('home.Tạo, cập nhật và theo dõi tiến độ hồ sơ mọi lúc, mọi nơi'),
  },
  {
    image: smartapply2,
    title: t('home.Kết nối hiệu quả với đối tác tuyển sinh'),
    description: t('home.Liên kết chặt chẽ giữa học sinh, trường học và tư vấn viên'),
  },
  {
    image: smartapply3,
    title: t('home.Dữ liệu lưu trữ an toàn trên Cloud S3'),
    description: t('home.Đồng bộ dữ liệu nhanh chóng, giảm thao tác thủ công'),
  },
  {
    image: smartapply4,
    title: t('home.Tùy biến quy trình nhập học'),
    description: t('home.Thiết kế lộ trình theo mô hình riêng của từng trường'),
  },
  {
    image: smartapply5,
    title: t('home.Tích hợp API với phần mềm tuyển sinh của trường'),
    description: t('home.Dữ liệu bảo mật cao, truy cập dễ dàng trên mọi thiết bị'),
  },
])
</script>

<template>
  <section class="hero py-10 px-4 bg-cover bg-no-repeat lg:py-20">
    <div class="container mx-auto">
      <h3 class="mt-0 mb-4 mx-auto text-label"> SMARTAPPLY </h3>
      <h2 class="mt-0 mb-4 text-heading text-center">
        {{ t('home.SmartApply – Tối ưu hồ sơ & quy trình nhập học') }}
      </h2>
      <p class="mt-0 mb-12 text-paragraph text-center">
        {{ t('home.Quản lý hồ sơ và quy trình nhập học chưa bao giờ dễ dàng đến thế') }}
      </p>

      <div class="p-4 grid grid-cols-1 gap-4 bg-[#F4F4F4] rounded-3xl lg:pg-6 lg:grid-cols-3">
        <div
          class="p-4 card bg-transparent rounded-3xl transition-all hover:bg-white"
          v-for="(item, index) in features"
          :key="index"
        >
          <img class="block mx-auto max-w-full" :src="item?.image" alt="" />
          <h3 class="my-2 text-base font-bold c-black-90 text-center">
            {{ item?.title }}
          </h3>
          <p class="m-0 text-base font-normal c-black-90 text-center">
            {{ item?.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.card:hover {
  box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.08);
}
</style>
