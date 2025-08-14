<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
})
const calcRate = computed(() => {
  if (!props.data?.lead_info || !props.data?.lead_total) return 0
  return ((props.data?.lead_info / props.data?.lead_total) * 100).toFixed(2)
})
</script>

<template>
  <div class="w-full fc">
    <div class="page-heading"> Overview </div>

    <div class="grid grid-cols-5 gap-4 mt-4">
      <div class="fr ai-c gap-4 p-4 rounded shadow bg-white">
        <img src="@/assets/icons/dashboard/lead.svg" alt="" />
        <div class="fc">
          <div class="text-base font-bold c-black-90"> Leads </div>
          <div class="text-2xl font-bold c-black-90"> {{ data?.lead_total }} </div>
        </div>
      </div>
      <div class="fr ai-c gap-4 p-4 rounded shadow bg-white">
        <img src="@/assets/icons/dashboard/chatbot.svg" alt="" />
        <div class="fc">
          <div class="text-base font-bold c-black-90"> Lead info </div>
          <div class="text-2xl font-bold c-black-90"> {{ data?.lead_info }} </div>
        </div>
      </div>
      <div class="fr ai-c gap-4 p-4 rounded shadow bg-white">
        <img src="@/assets/icons/dashboard/rate.svg" alt="" />
        <div class="fc">
          <div class="text-base font-bold c-black-90"> Average rate </div>
          <div class="text-2xl font-bold c-black-90"> {{ calcRate }} % </div>
        </div>
      </div>
      <div class="fr ai-c gap-4 p-4 rounded shadow bg-white">
        <img src="@/assets/icons/dashboard/campaign.svg" alt="" />
        <div class="fc">
          <div class="text-base font-bold c-black-90"> Campaign </div>
          <div class="text-2xl font-bold c-black-90"> {{ data?.iframe }} </div>
        </div>
      </div>
      <div class="fr ai-c gap-4 p-4 rounded shadow bg-white">
        <img src="@/assets/icons/dashboard/referral.svg" alt="" />
        <div class="fc">
          <div class="text-base font-bold c-black-90"> Referral </div>
          <div class="text-2xl font-bold c-black-90"> {{ data?.referral }} </div>
        </div>
      </div>
    </div>
  </div>
</template>
