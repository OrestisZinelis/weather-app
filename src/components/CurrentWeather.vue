<template>
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-4xl font-bold">{{ temperature }} {{ unit }}</h2>
      <p class="text-gray-400">{{ description }}</p>
    </div>
    <div>
      <img :src="imageSrc" :alt="description" class="w-24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Weather } from '@/types/weather.types'

const props = defineProps<{
  temperature: Weather['temperature']['detail']['value']
  unit: Weather['temperature']['detail']['unit']
  description: Weather['weather_description']
  weatherCode: Weather['weather_code']
  is_day: boolean
}>()

const weatherCodeToCodeMap: Record<Weather['weather_code'], Weather['weather_code']> = {
  2: 1,
  3: 1,
  48: 45,
  53: 51,
  55: 51,
  57: 56,
  63: 61,
  65: 61,
  67: 66,
  73: 71,
  75: 71,
  81: 80,
  82: 80,
  86: 85,
  99: 96,
}

const imageSrc = computed(() => {
  const code = weatherCodeToCodeMap[props.weatherCode] ?? props.weatherCode
  const suffix = props.is_day ? 'd' : 'n'
  return new URL(`../assets/wmo-svg/wmo_icon_${code}${suffix}.svg`, import.meta.url).href
})
</script>
