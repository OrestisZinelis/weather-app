<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <Card>
        <template #content>
          <div v-if="weather && !showSpinnerWeather" class="flex flex-col gap-10 pb-4">
            <PeriodSelector :selectedPeriod="selectedPeriod" @select-period="handleSelectPeriod" />
            <CurrentWeather
              :temperature="weather.temperature.detail.value"
              :description="weather.weather_description"
              :unit="weather.temperature.detail?.unit"
              :weatherCode="weather.weather_code"
              :is_day="weather.is_day"
            />
          </div>

          <div v-else class="flex justify-center">
            <ProgressSpinner />
          </div>
        </template>
      </Card>
      <Card>
        <template #content>
          <WeatherDetails
            v-if="weatherDetailsToShow && !showSpinnerWeather"
            :weatherDetails="weatherDetailsToShow"
          />

          <div v-else class="flex justify-center">
            <ProgressSpinner />
          </div>
        </template>
      </Card>
    </div>
    <Card>
      <template #content>
        <TemperatureChart
          v-if="weekTemperatures && !showSpinnerTemperatureForecast"
          :data="weekTemperatures"
        />

        <div v-else class="flex justify-center">
          <ProgressSpinner />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'

import { getCurrentWeather, getDailyWeather, getWeekTemperature } from '@/services/weather.api'

import { useDebouncedLoading } from '@/composables/useDebouncedLoading'

import { locations } from '@/constants/locations'

import type { Weather, WeatherDetail, WeekTemperatures } from '@/types/weather.types'
import type { SelectedPeriod } from '@/types/selectedDate.types'

import Card from 'primevue/card'
import CurrentWeather from '@/components/CurrentWeather.vue'
import PeriodSelector from '@/components/PeriodSelector.vue'
import WeatherDetails from '@/components/WeatherDetails.vue'
import TemperatureChart from '@/components/TemperatureChart.vue'
import ProgressSpinner from 'primevue/progressspinner'

onMounted(() => {
  fetchWeather()
  fetchTemperatureForecast()
})

const {
  showSpinner: showSpinnerWeather,
  startLoading: startLoadingWeather,
  stopLoading: stopLoadingWeather,
} = useDebouncedLoading(300)

const {
  showSpinner: showSpinnerTemperatureForecast,
  startLoading: startLoadingTemperatureForecast,
  stopLoading: stopLoadingTemperatureForecast,
} = useDebouncedLoading(300)

const selectedPeriod = ref<SelectedPeriod>('now')
const weather = ref<Weather | null>(null)
const weekTemperatures = ref<WeekTemperatures | null>(null)

const weatherDetailsToShow = computed<WeatherDetail[]>(() => {
  if (!weather.value) return []

  return [
    { id: 'feels_like', text: 'Feels Like', detail: weather.value.feels_like.detail },
    { id: 'wind', text: 'Wind', detail: weather.value.wind_speed.detail },
    { id: 'wind_gust', text: 'Wind Gust', detail: weather.value.wind_gust.detail },
    { id: 'wind_deg', text: 'Wind Deg', detail: weather.value.wind_direction.detail },
    { id: 'humidity', text: 'Humidity', detail: weather.value.humidity.detail },
    { id: 'pressure', text: 'Pressure', detail: weather.value.pressure.detail },
  ]
})

const handleSelectPeriod = (period: SelectedPeriod) => {
  if (!period) return
  selectedPeriod.value = period

  let date: string | undefined
  if (period === 'now') {
    date = undefined
  } else if (period === 'today') {
    date = dayjs().format('YYYY-MM-DD')
  } else {
    date = dayjs(period).format('YYYY-MM-DD')
  }

  fetchWeather(date)
}

const fetchWeather = async (date?: string) => {
  startLoadingWeather()

  const position = {
    latitude: locations.thessaloniki.latitude,
    longitude: locations.thessaloniki.longitude,
  }

  try {
    const data = date
      ? await getDailyWeather({ ...position, date })
      : await getCurrentWeather(position)

    weather.value = data
  } catch (error) {
    console.error('Failed to fetch weather:', error)
  } finally {
    stopLoadingWeather()
  }
}

const fetchTemperatureForecast = async () => {
  startLoadingTemperatureForecast()
  try {
    const data = await getWeekTemperature({
      latitude: locations.thessaloniki.latitude,
      longitude: locations.thessaloniki.longitude,
    })

    weekTemperatures.value = data
  } catch (error) {
    console.error('Failed to fetch 7days temperature forecast:', error)
  } finally {
    stopLoadingTemperatureForecast()
  }
}
</script>
