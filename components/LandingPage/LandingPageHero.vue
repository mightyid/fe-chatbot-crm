<template>
  <section class="hero py-10 px-4 bg-cover bg-no-repeat lg:py-40">
    <div class="container mx-auto">
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-10" data-aos="fade-right">
        <div class="flex-1">
          <h3 class="mt-0 mb-5 text-label text-center"> MỘT NỀN TẢNG - ĐA KÊNH - TỐI ĐA HIỆU QUẢ TUYỂN SINH </h3>

          <h1 class="mt-0 mb-4 text-heading"> Tối Ưu Tuyển Sinh - Vận Hành Đa Kênh Hiệu Quả </h1>
          <p class="mt-0 mb-4 text-paragraph text-center lg:text-left">
            Chọn giải pháp phù hợp với mọi quy mô trung tâm và trường học – từ khởi đầu vững chắc đến quản lý tuyển sinh
            toàn diện. Maple STC giúp bạn tăng tốc quy trình, tư vấn 24/7, quản lý hồ sơ và kết nối học sinh với trường
            học một cách thông minh và tự động.
          </p>

          <Button class="block mx-auto lg:mx-unset" label="Bắt đầu ngay" severity="primary" type="button" />
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
