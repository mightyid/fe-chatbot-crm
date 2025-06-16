<template>
  <section class="hero py-10 px-4 bg-cover bg-no-repeat lg:py-20" data-aos="fade-up">
    <div class="container mx-auto">
      <h3 class="mt-0 mb-4 mx-auto text-label"> CRM </h3>
      <h2 class="mt-0 mb-4 text-heading text-center"> CRM - Quản lý tuyển sinh chuyên nghiệp </h2>
      <p class="mt-0 mb-12 text-paragraph text-center">
        Tối ưu quy trình chăm sóc học sinh với hệ thống CRM mạnh mẽ: quản lý lead hiệu quả, lưu trữ tương tác tư vấn,
        phân quyền linh hoạt và cập nhật dữ liệu liên tục từ chatbot. Tất cả trong một nền tảng – trực quan, đồng bộ và
        dễ triển khai.
      </p>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:auto-rows-fr lg:relative">
        <div
          class="p-4 card--clip-bottom-right rounded-2xl lg:p-6"
          style="background: linear-gradient(140deg, #f7fcff 8.48%, #d4f1fe 81.76%)"
        >
          <div class="flex gap-4">
            <div class="flex-1">
              <p class="mt-0 mb-2 text-lg font-bold c-black-90 lg:text-2xl"> Tùy biến luồng tư vấn sale </p>
              <p class="m-0 text-base font-normal c-black-60">
                Thiết lập quy trình chăm sóc học sinh theo từng chiến dịch, từng giai đoạn. Tự do chọn cách phân loại,
                gắn nhãn và theo dõi hiệu quả tư vấn.
              </p>
            </div>

            <div class="flex-1">
              <img class="block max-w-full" src="~/assets/images/landing-page/crm-1-1.png" alt="" />
            </div>
          </div>

          <img class="block mx-auto max-w-full" src="~/assets/images/landing-page/crm-1-2.png" alt="" />
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div
            class="p-4 card---clip-bottom-left rounded-2xl lg:p-6"
            style="background: linear-gradient(155deg, #fff3ef -23.5%, #ffe4da 80.24%)"
          >
            <p class="mt-0 mb-2 text-lg font-bold c-black-90 lg:text-2xl"> Phân quyền không giới hạn nhân sự </p>
            <p class="m-0 text-base font-normal c-black-60">
              Thêm bao nhiêu người dùng tùy ý. Chia quyền linh hoạt theo vai trò để phối hợp làm việc mượt mà giữa các
              bộ phận.
            </p>

            <img class="block mx-auto max-w-full" src="~/assets/images/landing-page/crm-2-1.png" alt="" />
          </div>

          <div
            class="p-4 rounded-2xl lg:p-6"
            style="background: linear-gradient(155deg, #fff3ef -23.5%, #ffe4da 80.24%)"
          >
            <p class="mt-0 mb-2 text-lg font-bold c-black-90 lg:text-2xl"> Ghi chú và lưu trữ nội dung tư vấn </p>
            <p class="m-0 text-base font-normal c-black-60">
              Lưu lại mọi trao đổi với học sinh theo từng hồ sơ – đảm bảo không bỏ sót thông tin và dễ dàng theo dõi
              lịch sử chăm sóc.
            </p>

            <img class="block mx-auto max-w-full" src="~/assets/images/landing-page/crm-2-2.png" alt="" />
          </div>
        </div>

        <div
          class="p-4 card---clip-top-right flex flex-col gap-4 rounded-2xl lg:p-6"
          style="background: linear-gradient(316deg, #f3dffe 15.17%, #faf2ff 94.36%)"
        >
          <div class="order-2 lg:order-1">
            <div class="flex items-end">
              <img class="block max-w-full" src="~/assets/images/landing-page/crm-3-1.png" alt="" />
              <img class="block max-w-full" src="~/assets/images/landing-page/crm-3-2.png" alt="" />
            </div>
            <img class="mx-auto block max-w-full xl:ml-[10%]" src="~/assets/images/landing-page/crm-3-3.png" alt="" />
          </div>

          <div class="order-1 lg:order-2">
            <p class="mt-0 mb-2 text-lg font-bold c-black-90 lg:text-2xl"> Tự động đồng bộ thông tin từ chatbot </p>
            <p class="m-0 text-base font-normal c-black-60">
              Toàn bộ dữ liệu thu thập từ chatbot được đồng bộ về CRM ngay tức thì – không cần nhập tay, không lo trùng
              lặp.
            </p>
          </div>
        </div>

        <div
          class="p-4 card---clip-top-left flex flex-col gap-4 rounded-2xl lg:p-6"
          style="background: linear-gradient(318deg, #fff5d4 13.99%, #fffbed 95.74%)"
        >
          <img
            class="flex-1 order-2 block mx-auto max-w-full lg:order-1 lg:pt-20"
            src="~/assets/images/landing-page/crm-4.png"
            alt=""
          />

          <div class="order-1 lg:order-2">
            <p class="mt-0 mb-2 text-lg font-bold c-black-90 lg:text-2xl"> Tùy biến luồng tư vấn sale </p>
            <p class="m-0 text-base font-normal c-black-60">
              Thiết lập quy trình chăm sóc học sinh theo từng chiến dịch, từng giai đoạn. Tự do chọn cách phân loại, gắn
              nhãn và theo dõi hiệu quả tư vấn.
            </p>
          </div>
        </div>

        <div class="hidden p-4 absolute top-[50%] left-[50%] translate-[-50%] bg-white rounded-full lg:block">
          <img src="~/assets/images/landing-page/crm-circle.svg" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.card--clip-bottom-right {
  clip-path: url(#clip-bottom-right);
}

.card---clip-bottom-left {
  clip-path: url(#clip-bottom-left);
}

.card---clip-top-right {
  clip-path: url(#clip-top-right);
}

.card---clip-top-left {
  clip-path: url(#clip-top-left);
}
</style>
