<template>
  <div class="flex flex-col gap-8">
    <h3 class="text-xl font-bold">Weekly variation</h3>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Chart from 'primevue/chart'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart as ChartJS } from 'chart.js'
import type { TemperatureForecast } from '@/types/weather.types'

ChartJS.register(ChartDataLabels)
const props = defineProps<{ data: TemperatureForecast }>()

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: props.data.dates,
    datasets: [
      {
        label: 'Temperature',
        data: props.data.temperatures.values,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.4,
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    datalabels: {
      align: 'top',
      anchor: 'end',
      color: documentStyle.getPropertyValue('--p-text-color'),
      font: {
        size: 12,
      },
    },
    plugins: {
      datalabels: {
        color: textColor,
        font: {
          size: 12,
        },
        formatter: (value: number) => {
          return `${value}${props.data.temperatures.unit}`
        },
        align: 'top',
      },
      legend: {
        align: 'start',
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          display: false,
        },
      },
    },
  }
}
</script>
