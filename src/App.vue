<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <Card>
        <template #content>
          <div v-if="weather && !showSpinnerWeather" class="flex flex-col gap-10 pb-4">
            <ForecastSelector :selected-date="selectedDate" @select-date="handleSelectDate" />
            <CurrentWeather
              :temperature="normalizedWeatherData?.temperature.detail.value"
              :description="weather?.weather_description"
              :unit="weather?.temperature.detail?.unit"
              :weatherCode="weather?.weather_code"
              :is_day="weather?.is_day"
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
    <Card v-if="forecast">
      <template #content>
        <TemperatureChart
          v-if="normalizedForecastData && !showSpinnerTemperatureForecast"
          :data="normalizedForecastData"
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

import { getCurrentWeather, getDailyWeather, getTemperatureForcast } from '@/services/weather.api'

import { useDebouncedLoading } from '@/composables/useDebouncedLoading'
import { customRound } from '@/helpers/number.helpers'
import { locations } from '@/constants/locations'

import type { Weather, WeatherDetail, TemperatureForecast } from '@/types/weather.types'
import type { SelectedDate } from '@/types/selectedDate.types'

import Card from 'primevue/card'
import CurrentWeather from '@/components/CurrentWeather.vue'
import ForecastSelector from '@/components/ForecastSelector.vue'
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

const selectedDate = ref<SelectedDate>('now')
const weather = ref<Weather | null>(null)
const forecast = ref<TemperatureForecast | null>(null)

const weatherDetailsToShow = computed<WeatherDetail[]>(() => {
  if (!weather.value) return []

  return [
    { id: 'feels_like', text: 'Feels Like', detail: normalizedWeatherData.value.feels_like.detail },
    { id: 'wind', text: 'Wind', detail: weather.value.wind_speed.detail },
    { id: 'wind_gust', text: 'Wind Gust', detail: weather.value.wind_gust.detail },
    { id: 'wind_deg', text: 'Wind Deg', detail: weather.value.wind_direction.detail },
    { id: 'humidity', text: 'Humidity', detail: weather.value.humidity.detail },
    { id: 'pressure', text: 'Pressure', detail: weather.value.pressure.detail },
  ]
})

const normalizedForecastData = computed(() => ({
  dates: forecast.value?.dates.map((date) => dayjs(date).format('DD/MM')) ?? [],
  temperatures: forecast.value?.temperatures
    ? {
        values: forecast.value.temperatures.values.map((value) => customRound(value)),
        unit: forecast.value.temperatures.unit,
      }
    : { values: [], unit: '' },
}))

const normalizedWeatherData = computed(() => ({
  ...weather.value,
  temperature: {
    detail: {
      unit: weather.value?.temperature.detail?.unit ?? '',
      value: customRound(weather.value?.temperature.detail?.value ?? 0),
    },
  },
  feels_like: {
    detail: {
      unit: weather.value?.feels_like.detail?.unit ?? '',
      value: customRound(weather.value?.feels_like.detail?.value ?? 0),
    },
  },
}))

const handleSelectDate = (date: SelectedDate) => {
  if (!date) return
  selectedDate.value = date

  let formattedDate
  if (date === 'now') {
    formattedDate = undefined
  } else if (date === 'today') {
    formattedDate = dayjs().format('YYYY-MM-DD')
  } else {
    formattedDate = dayjs(date).format('YYYY-MM-DD')
  }

  fetchWeather(formattedDate)
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
    const data = await getTemperatureForcast({
      latitude: locations.thessaloniki.latitude,
      longitude: locations.thessaloniki.longitude,
    })

    forecast.value = data
  } catch (error) {
    console.error('Failed to fetch weather:', error)
  } finally {
    stopLoadingTemperatureForecast()
  }
}
</script>
