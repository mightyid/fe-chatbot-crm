<script lang="ts" setup>
import DashboardChart from '~/components/admin/dashboard/DashboardChart.vue'
import DashboardNumber from '~/components/admin/dashboard/DashboardNumber.vue'
import DashboardTop from '~/components/admin/dashboard/DashboardTop.vue'

const route = useRoute()
const { $api, $dayjs: dayjs } = useNuxtApp()
const listNumber = ref({})
const listTop = ref({})
const dataChart = ref({})
const query = ref({
  // from: '2025-06-01',
  from: dayjs().startOf('month').format('YYYY-MM-DD'),
  to: dayjs().endOf('month').format('YYYY-MM-DD'),
})
const getDataNumber = async () => {
  const { result }: any = await $api('/admin/dashboard/number', {
    method: 'GET',
    params: {
      company_id: route.params.id,
      from: dayjs(query.value.from).format('YYYY-MM-DD'),
      to: dayjs(query.value.to).format('YYYY-MM-DD'),
    },
  })
  listNumber.value = result || {}
}
const getDataTop = async () => {
  const { result }: any = await $api('/admin/dashboard/top', {
    method: 'GET',
    params: {
      company_id: route.params.id,
      from: dayjs(query.value.from).format('YYYY-MM-DD'),
      to: dayjs(query.value.to).format('YYYY-MM-DD'),
    },
  })
  console.log(result, 'result')
  listTop.value = result || {}
}
const getDataChart = async () => {
  const { result }: any = await $api('/admin/dashboard/chart', {
    method: 'GET',
    params: {
      company_id: route.params.id,
      from: dayjs(query.value.from).format('YYYY-MM-DD'),
      to: dayjs(query.value.to).format('YYYY-MM-DD'),
    },
  })
  console.log(result, 'result')
  dataChart.value = result || {}
}
getDataNumber()
getDataTop()
getDataChart()
watch(
  () => query.value,
  () => {
    getDataNumber()
    getDataTop()
    getDataChart()
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div class="page">
    <div class="page-content fc gap-6">
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-4"></div>
        <BaseInputCalendar label="From" v-model="query.from" />
        <BaseInputCalendar label="To" v-model="query.to" />
      </div>
      <DashboardNumber :data="listNumber" />
      <DashboardChart :data="dataChart" />
      <DashboardTop :data="listTop" />
    </div>
  </div>
</template>
