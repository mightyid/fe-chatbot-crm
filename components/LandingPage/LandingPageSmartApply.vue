<script setup lang="ts">
import smartapply1 from '~/assets/images/landing-page/smartapply-1.svg'
import smartapply2 from '~/assets/images/landing-page/smartapply-2.svg'
import smartapply3 from '~/assets/images/landing-page/smartapply-3.svg'
import smartapply4 from '~/assets/images/landing-page/smartapply-4.svg'
import smartapply5 from '~/assets/images/landing-page/smartapply-5.svg'

const features = [
  {
    image: smartapply1,
    title: 'Theo dõi hồ sơ online thời gian thực',
    description: 'Tạo, cập nhật và theo dõi tiến độ hồ sơ mọi lúc, mọi nơi.',
  },
  {
    image: smartapply2,
    title: 'Kết nối hiệu quả với đối tác tuyển sinh',
    description: 'Liên kết chặt chẽ giữa học sinh, trường học và tư vấn viên.',
  },
  {
    image: smartapply3,
    title: 'Tích hợp API với phần mềm tuyển sinh của trường',
    description: 'Đồng bộ dữ liệu nhanh chóng, giảm thao tác thủ công.',
  },
  {
    image: smartapply4,
    title: 'Tùy biến quy trình nhập học',
    description: 'Thiết kế lộ trình theo mô hình riêng của từng trường.',
  },
  {
    image: smartapply5,
    title: 'Tích hợp API với phần mềm tuyển sinh của trường',
    description: 'Dữ liệu bảo mật cao, truy cập dễ dàng trên mọi thiết bị.',
  },
]
</script>

<template>
  <section class="hero py-10 px-4 bg-cover bg-no-repeat lg:py-20" data-aos="fade-up">
    <div class="container mx-auto">
      <h3 class="mt-0 mb-4 mx-auto text-label"> SMARTAPPLY </h3>
      <h2 class="mt-0 mb-4 text-heading text-center"> SmartApply – Tối ưu hồ sơ & quy trình nhập học </h2>
      <p class="mt-0 mb-12 text-paragraph text-center">
        Quản lý hồ sơ và quy trình nhập học chưa bao giờ dễ dàng đến thế. Với SmartApply, học sinh và nhà trường có thể
        theo dõi tiến độ theo thời gian thực, kết nối chặt chẽ giữa các bên liên quan và cá nhân hóa quy trình theo nhu
        cầu riêng.
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
