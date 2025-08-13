<script lang="ts" setup>
import BotHuongNghiep from '~/components/huong-nghiep/BotHuongNghiep.vue'
import ComAbout from '~/components/huong-nghiep/ComAbout.vue'
import ComAdvisor from '~/components/huong-nghiep/ComAdvisor.vue'
import ComHero from '~/components/huong-nghiep/ComHero.vue'
import ComHolland from '~/components/huong-nghiep/ComHolland.vue'
import ComHowItWork from '~/components/huong-nghiep/ComHowItWork.vue'
import ComOrientation from '~/components/huong-nghiep/ComOrientation.vue'
import ComPricing from '~/components/huong-nghiep/ComPricing.vue'
import ComTarget from '~/components/huong-nghiep/ComTarget.vue'
import ComVisor from '~/components/huong-nghiep/ComVisor.vue'
import LandingPageFooter from '~/components/LandingPage/LandingPageFooter.vue'
definePageMeta({
  auth: false,
  layout: 'blank',
})
useHead({
  title: 'Hướng nghiệp AI',
  meta: [
    {
      name: 'description',
      content:
        'Trải nghiệm công cụ hướng nghiệp ứng dụng Trí Tuệ Nhân Tạo (A.I) theo chuẩn giáo dục Việt Nam và quốc tế',
    },
  ],
})
</script>

<template>
  <div class="fc">
    <ComHero />
    <ComAbout />
    <div class="mt-134px">
      <ComVisor />
    </div>
    <div class="mt-134px">
      <ComHolland />
    </div>
    <div class="mt-134px">
      <ComHowItWork />
    </div>
    <div class="mt-134px">
      <ComOrientation />
    </div>

    <div class="mt-134px">
      <ComTarget />
    </div>
    <div class="mt-134px">
      <ComPricing />
    </div>
    <!-- <div class="mt-134px">
      <ComAdvisor />
    </div> -->
    <div class="mt-134px p-10 bg-#E7F7FE relative w-full" id="chatbot">
      <div class="text-center text-2xl lg:text-5xl leading-36px lg:leading-68px font-bold max-w-1200px mx-a">
        Tư vấn trực tiếp với AI
      </div>
      <div class="text-center text-base font-normal max-w-1200px mx-a">
        Trò chuyện cùng chatbot để khám phá bản thân theo cách thú vị và đơn giản nhất.
      </div>
      <div class="mt-8 z-2 relative">
        <BotHuongNghiep />
      </div>
      <div class="absolute w-full bottom-0 left-0">
        <img src="@/assets/images/huong-nghiep/background-chatbot.png" alt="" class="w-full" />
      </div>
    </div>
    <LandingPageFooter />
  </div>
</template>
