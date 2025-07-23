<script lang="ts" setup>
const { t } = useI18n()
</script>
<template>
  <footer class="py-[48px] px-4 lg:px-0 bg-[#F9F9F9]">
    <div class="container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="flex flex-col gap-4">
          <nuxt-link to="/sign-in">
            <img class="" src="~/assets/images/logo.svg" alt="" />
          </nuxt-link>
        </div>

        <div class="flex flex-col gap-4">
          <p class="m-0 pb-2 text-base font-bold c-black-90"> Chính sách </p>
          <nuxt-link href="/terms-of-conditions" target="_blank" class="text-base font-normal c-black-90 block">
            Điều khoản sử dụng
          </nuxt-link>
          <nuxt-link href="/privacy" target="_blank" class="text-base font-normal c-black-90 block">
            Chính sách bảo mật
          </nuxt-link>
        </div>

        <div class="flex flex-col gap-4">
          <p class="m-0 pb-2 text-base font-bold c-black-90"> Liên hệ </p>
          <p class="m-0 text-base font-normal c-black-90">
            <span class="text-base font-normal c-black-60 block"> Điện thoại</span>
            <span class="text-base font-normal c-black-90 block">(+84) 78 555 2875</span>
          </p>

          <p class="m-0 text-base font-normal c-black-90">
            <span class="text-base font-normal c-black-60 block">Email</span>
            <span class="text-base font-normal c-black-90 block">admin@mightyid.ca</span>
          </p>

          <p class="m-0 text-base font-normal c-black-90">
            <span class="text-base font-normal c-black-60 block"> Địa chỉ</span>
            <span class="mb-4 text-base font-normal c-black-90 block">
              Tầng 2, Tòa nhà Vinafor Sài Gòn, Đường Trương Định, Quận 3, Thành phố Hồ Chí Minh, Việt Nam
            </span>
          </p>
        </div>
      </div>

      <div class="mb-6 mt-[64px] h-[1px] w-full bg-[#313131]"></div>

      <div class="flex justify-center gap-10">
        <span class="text-base font-normal text-[#676767]"> ©2024 MightyID Vietnam </span>
      </div>
    </div>
  </footer>
</template>
