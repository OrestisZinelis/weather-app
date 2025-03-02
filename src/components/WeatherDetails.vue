<template>
  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="{ id, text, detail: { value, unit } } in weatherDetails"
      :key="id"
      class="py-8 px-4 border border-gray-200 rounded-lg"
    >
      <div class="flex items-end gap-1">
        <span class="text-2xl font-bold">{{ value }}</span>
        <span :class="{ 'text-2xl': showLargeUnit(id) }">{{ unit }}</span>
      </div>
      <p class="text-sm text-gray-400">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeatherDetail } from '@/types/weather.types'

export type WeatherDetailId =
  | 'feels_like'
  | 'wind'
  | 'wind_gust'
  | 'wind_deg'
  | 'humidity'
  | 'pressure'

defineProps<{ weatherDetails: WeatherDetail[] }>()

const showLargeUnit = (id?: WeatherDetailId) => ['feels_like', 'wind_deg'].includes(id ?? '')
</script>
