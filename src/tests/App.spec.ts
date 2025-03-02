import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import dayjs from 'dayjs'

import AppView from '@/App.vue'

import * as weatherAPI from '@/services/weather.api'

const mockWeatherData = {
  date: '2023-01-01',
  temperature: {
    detail: {
      value: 22.5,
      unit: '°C',
    },
  },
  feels_like: {
    detail: {
      value: 24.3,
      unit: '°C',
    },
  },
  weather_description: 'Sunny',
  weather_code: 800,
  is_day: true,
  wind_speed: {
    detail: {
      value: 5,
      unit: 'km/h',
    },
  },
  wind_gust: {
    detail: {
      value: 8,
      unit: 'km/h',
    },
  },
  wind_direction: {
    detail: {
      value: 180,
      unit: '°',
    },
  },
  humidity: {
    detail: {
      value: 65,
      unit: '%',
    },
  },
  pressure: {
    detail: {
      value: 1013,
      unit: 'hPa',
    },
  },
  rain: {
    detail: {
      value: 0,
      unit: 'mm',
    },
  },
  showers: {
    detail: {
      value: 0,
      unit: 'mm',
    },
  },
  snowfall: {
    detail: {
      value: 0,
      unit: 'mm',
    },
  },
}

const mockForecastData = {
  dates: [
    dayjs().format('YYYY-MM-DD'),
    dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dayjs().add(2, 'day').format('YYYY-MM-DD'),
    dayjs().add(3, 'day').format('YYYY-MM-DD'),
    dayjs().add(4, 'day').format('YYYY-MM-DD'),
  ],
  temperatures: {
    values: [22.5, 23.1, 24.7, 22.3, 21.8],
    unit: '°C',
  },
}

describe('AppView', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.spyOn(weatherAPI, 'getCurrentWeather').mockResolvedValue(mockWeatherData)
    vi.spyOn(weatherAPI, 'getDailyWeather').mockResolvedValue(mockWeatherData)
    vi.spyOn(weatherAPI, 'getTemperatureForcast').mockResolvedValue(mockForecastData)
  })

  it('should fetch weather data on mount', async () => {
    mount(AppView, {
      global: {
        stubs: {
          CurrentWeather: true,
          ForecastSelector: true,
          WeatherDetails: true,
          TemperatureChart: true,
          Card: true,
          ProgressSpinner: true,
        },
      },
    })

    await flushPromises()

    expect(weatherAPI.getCurrentWeather).toHaveBeenCalledTimes(1)
    expect(weatherAPI.getTemperatureForcast).toHaveBeenCalledTimes(1)
  })

  it('should handle API errors gracefully', async () => {
    // Make API calls throw errors
    vi.spyOn(weatherAPI, 'getCurrentWeather').mockRejectedValue(new Error('API error'))
    vi.spyOn(weatherAPI, 'getTemperatureForcast').mockRejectedValue(new Error('API error'))

    // Mock console.error to avoid polluting test output
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(AppView, {
      global: {
        stubs: {
          CurrentWeather: true,
          ForecastSelector: true,
          WeatherDetails: true,
          TemperatureChart: true,
          Card: {
            template: '<div class="card"><slot></slot></div>',
          },
          ProgressSpinner: true,
        },
      },
    })

    await flushPromises()

    expect(consoleErrorMock).toHaveBeenCalledWith('Failed to fetch weather:', expect.any(Error))

    // Check if the spinner is shown (error state should show spinner)
    const card = wrapper.find('.card')
    expect(card.exists()).toBe(true)

    consoleErrorMock.mockRestore()
  })
})
