<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
})
</script>

<template>
  <div class="w-full fc">
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="fc gap-4 p-4 bg-white rounded shadow">
        <div class="page-heading">Top chatbots </div>
        <div class="fr jc-sb ai-c gap-4 w-full" v-if="data?.bot" v-for="item in data.bot || []">
          <div class="line-clamp-1 text-base font-semibold c-black-90">{{ item?.bot?.name }}</div>
          <div class="line-clamp-1 text-base font-normal c-black-60 min-w-30px"> {{ item?.total || 0 }}</div>
        </div>
      </div>
      <div class="fc gap-4 p-4 bg-white rounded shadow">
        <div class="page-heading"> Top referrers </div>
        <div class="fr jc-sb ai-c gap-4 w-full" v-if="data?.referral" v-for="item in data.referral || []">
          <div class="line-clamp-1 text-base font-semibold c-black-90">{{ item?.referral?.name }}</div>
          <div class="line-clamp-1 text-base font-normal c-black-60 min-w-30px"> {{ item?.total || 0 }}</div>
        </div>
      </div>
      <div class="fc gap-4 p-4 bg-white rounded shadow">
        <div class="page-heading"> Top campaign </div>
        <div class="fr jc-sb ai-c gap-4 w-full" v-if="data?.iframe" v-for="item in data.iframe || []">
          <div class="line-clamp-1 text-base font-semibold c-black-90">{{ item?.iframe?.name }}</div>
          <div class="line-clamp-1 text-base font-normal c-black-60 min-w-30px"> {{ item?.total || 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
