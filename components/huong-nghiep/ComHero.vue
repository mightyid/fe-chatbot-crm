<script lang="ts" setup></script>

<template>
  <div class="bg-#E7F7FE pb-50px">
    <div class="container max-w-1200px mx-a py-2">
      <div class="fr jc-sb ai-c">
        <nuxt-link to="/">
          <img src="@/assets/images/logo.svg" alt="" />
        </nuxt-link>
        <a href="tel:(+84) 78 555 2875" class="c-primary font-semibold">Hotline: (+84) 78 555 2875</a>
      </div>

      <div class="fc ai-c gap-6">
        <div class="fr jc-c mt-68px">
          <span class="text-3xl lg:text-6xl leading-36px lg:leading-68px font-bold c-black-90 max-w-1100px text-center">
            Khám Phá <span class="c-primary"> Điểm Mạnh </span>- Định Hướng
            <span class="c-primary relative"
              >Tương Lai

              <img
                src="~/assets/images/huong-nghiep/i-text.svg"
                alt=""
                class="absolute top-[-4px] right-[-16px] hidden lg:block"
              />
              <img
                src="~/assets/images/huong-nghiep/i-gach.svg"
                alt=""
                class="absolute bottom-[-6px] left-0 hidden lg:block"
              />
            </span>
          </span>
        </div>

        <div class="text-base text-center c-black-80">
          Trải nghiệm công cụ hướng nghiệp ứng dụng Trí Tuệ Nhân Tạo (A.I) đầu tiên theo chuẩn giáo dục Việt Nam và quốc
          tế
        </div>
        <nuxt-link to="#chatbot">
          <Button severity="primary" type="button" :rounded="true">
            Bắt đầu ngay <img src="@/assets/images/huong-nghiep/i-arrow-right.svg" class="icon" alt="" />
          </Button>
        </nuxt-link>
      </div>

      <img src="~/assets/images/huong-nghiep/background-hero.svg" alt="" class="w-full" />
    </div>
  </div>
  <div class="fr jc-c container max-w-1200px mx-a">
    <img src="~/assets/images/huong-nghiep/people-hero.png" alt="" class="translate-y-[-40%] w-full" />
  </div>
</template>
