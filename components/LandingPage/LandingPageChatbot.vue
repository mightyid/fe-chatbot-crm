<script setup lang="ts">
const { t } = useI18n()

const features = computed(() => [
  {
    content: t('home.Chatbot hỗ trợ tư vấn tuyển sinh 24/7'),
    classPosition: 'top-[10%] left-[50%]',
  },
  {
    content: t('home.Tích hợp trực tiếp với website, fanpage và các kênh tuyển sinh số'),
    classPosition: 'top-[30%] right-0',
  },
  {
    content: t('home.Có khả năng học hành vi người dùng và điều chỉnh câu trả lời dựa trên lịch sử tương tác'),
    classPosition: 'bottom-[30%] right-0',
  },
  {
    content: t('home.Nhân viên có thể theo dõi lịch sử trò chuyện và phối hợp hỗ trợ chuyên sâu'),
    classPosition: 'top-[20%] left-[5%]',
  },
  {
    content: t(
      'home.Tự động thu thập dữ liệu từ học sinh trực tiếp qua tin nhắn - nhanh chóng, không cần điền biểu mẫu',
    ),
    classPosition: 'top-[55%] left-0',
  },
])
</script>

<template>
  <section class="hero py-10 px-4 bg-cover bg-no-repeat lg:py-20">
    <div class="container mx-auto">
      <h3 class="mt-0 mb-4 text-label mx-auto"> CHATBOT </h3>
      <h2 class="mt-0 mb-4 text-heading text-center"> {{ t('home.Chatbot thông minh - Tư vấn 24/7') }} </h2>
      <p class="mt-0 mb-4 text-paragraph text-center">
        {{ t('home.Tăng tốc tuyển sinh với chatbot AI hỗ trợ tư vấn mọi lúc') }}
      </p>

      <div class="flex flex-col gap-4 lg:relative lg:block">
        <img class="block mx-auto max-w-full" src="~/assets/images/landing-page/chatbot-image.svg" alt="" />

        <div class="flex flex-col gap-4 lg:block">
          <div
            class="p-2 flex items-center gap-2 bg-white border border-solid border-primary rounded-2xl lg:absolute lg:max-w-[340px]"
            :class="item?.classPosition"
            v-for="(item, index) in features"
            :key="index"
          >
            <img src="~/assets/images/landing-page/chatbot-icon.svg" alt="" />
            <p class="m-0 text-sm font-normal c-[#313131]">
              {{ item?.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
