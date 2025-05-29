<script lang="ts" setup>
const { $api } = useNuxtApp()
const route = useRoute()
const info = ref<any>({})
const getData = async () => {
  const { result }: any = await $api(`/lead/${route.params.id}`, {
    method: 'GET',
    params: {
      message: 1,
    },
  })
  console.log(result, 'result')
  info.value = result
}
getData()
const updateStopBot = async () => {
  const { result }: any = await $api(`message/stop-start-bot`, {
    method: 'POST',
    body: {
      lead_id: route.params.id,
      stop_bot: info.value.stop_bot,
    },
  })
  console.log(result, 'result')
}
</script>

<template>
  <div class="flex-1 fc p-4">
    <div class="fc jc-c ai-c gap-4 mt-4">
      <BaseAvatar :size="64" :url="info?.bot?.avatar" />
      <div class="text-lg font-semibold c-black-90 capitalize">{{ info?.name }}</div>
    </div>
    <BaseSwitch label="Stop bot " name="stop_bot" v-model="info.stop_bot" @update:model-value="updateStopBot" />
  </div>
</template>
