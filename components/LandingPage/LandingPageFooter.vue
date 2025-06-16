<template>
  <footer class="py-10 px-4 bg-[#F9F9F9] border-t border-t-solid border-black-30 lg:py-20">
    <div class="container mx-auto">
      <div class="mb-10 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div>
          <p class="mt-0 mb-6 text-base font-bold c-black-90"> Company </p>

          <ul class="p-0 flex flex-col gap-4 list-none">
            <li>
              <a class="text-base font-normal c-black-90" href="https://mightyid.ca/about"> About </a>
            </li>
            <!-- <li>
              <a class="text-base font-normal c-black-90" href=""> Blog </a>
            </li>
            <li>
              <a class="text-base font-normal c-black-90" href=""> Contact </a>
            </li>
            <li>
              <a class="text-base font-normal c-black-90" href=""> Terms of Service </a>
            </li>
            <li>
              <a class="text-base font-normal c-black-90" href=""> Privacy Policy </a>
            </li> -->
          </ul>
        </div>

        <div>
          <p class="mt-0 mb-6 text-base font-bold c-black-90"> Canada Office </p>

          <ul class="p-0 flex flex-col gap-4 list-none">
            <li>
              <p class="m-0 text-base font-normal c-black-60"> Phone </p>
              <a class="text-base font-normal c-black-90" href="tel:+17789278513"> (+1) 778 927 8513 </a>
            </li>
            <li>
              <p class="m-0 text-base font-normal c-black-60"> Email </p>
              <a class="text-base font-normal c-black-90" href="mailto:info@mightyid.ca"> info@mightyid.ca </a>
            </li>
            <li>
              <p class="m-0 text-base font-normal c-black-60"> Address </p>
              <p class="mt-0 text-base font-normal c-black-90">
                1250 Homer Street, Unit 501, Vancouver, BC V6B 1C6, Canada
              </p>
            </li>
          </ul>
        </div>

        <div>
          <p class="mt-0 mb-6 text-base font-bold c-black-90"> Vietnam Office </p>

          <ul class="p-0 flex flex-col gap-4 list-none">
            <li>
              <p class="m-0 text-base font-normal c-black-60"> Phone </p>
              <a class="text-base font-normal c-black-90" href="tel:+84785552875"> (+84) 785 552 875 </a>
            </li>
            <li>
              <p class="m-0 text-base font-normal c-black-60"> Email </p>
              <a class="text-base font-normal c-black-90" href="mailto:info@mightyid.ca"> info@mightyid.ca </a>
            </li>
            <li>
              <p class="m-0 text-base font-normal c-black-60"> Address </p>
              <p class="mt-0 text-base font-normal c-black-90">
                64 Truong Dinh st, Vo Thi Sau ward, district 3, HCMC, Vietnam
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-10 border-t border-t-solid border-t-[#C2C2C2]">
        <nuxt-link to="/">
          <img class="h-[48px]" src="~/assets/images/logo.svg" alt="" />
        </nuxt-link>

        <p class="mt-2 mb-0 text base font-normal c-[#8A8A8A]"> © MightyID Chatbot 2025 </p>
      </div>
    </div>
  </footer>
</template>
