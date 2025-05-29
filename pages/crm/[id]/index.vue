<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
})
const columns = ref([])
const { $api } = useNuxtApp()
const getDataColumn = async () => {
  const { data }: any = await $api(`crm-field`, {
    method: 'GET',
  })
  columns.value = unref(data)?.result || []
}
getDataColumn()
</script>

<template>
  <div class="grid grid-cols-3 gap-4" v-if="data?.data">
    <div class="fc">
      <div class="c-black-60"> Name </div>
      <div class="c-black-90">{{ data.name }}</div>
    </div>
    <div class="fc min-h-70vh" v-for="(item, index) in (Object.values(data?.data) as any)" :key="item.value">
      <div class="c-black-60">
        {{
          columns.find((i: any) => i._id === Object.keys(data?.data)[index])
            ? columns.find((i: any) => i._id === Object.keys(data?.data)[index]).label
            : item.label
        }}
      </div>
      <div class="c-black-90">{{ item.value }}</div>
    </div>
  </div>
</template>
