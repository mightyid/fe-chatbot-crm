<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
})
const chartData = ref()
const chartOptions = ref()
onMounted(() => {
  // chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const setChartData = () => {
  const arr = props.data?.incognito?.map((item: any) => item.date)
  const dataIncognito = props.data?.incognito?.map((item: any) => item.total)
  const dataQualified = props.data?.quality?.map((item: any) => item.total)
  return {
    labels: arr,
    datasets: [
      {
        type: 'bar',
        label: 'Qualified',
        backgroundColor: '#5ECBF9',
        data: dataQualified,
      },
      {
        type: 'bar',
        label: 'Incognito',
        backgroundColor: '#E1E1E1',
        data: dataIncognito,
      },
    ],
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
}
watch(
  () => props.data,
  (newValue) => {
    if (newValue?.incognito) {
      chartData.value = setChartData()
    }
    // chartData.value = setChartData()
    // console.log(
    //   props.data?.incognito?.map((item: any) => item._id),
    //   'props.data?.incognito?.map((item: any) => item._id),',
    // )
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="w-full fc">
    <div class="page-heading"> Statistics and reports </div>

    <div class="bg-white mt-4 p-4 rounded">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-30rem" />
    </div>
  </div>
</template>
