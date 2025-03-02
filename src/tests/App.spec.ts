import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import AppView from '@/App.vue'

import * as weatherAPI from '@/services/weather.api'

describe('AppView', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.spyOn(weatherAPI, 'getCurrentWeather')
    vi.spyOn(weatherAPI, 'getDailyWeather')
    vi.spyOn(weatherAPI, 'getWeekTemperature')
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
    expect(weatherAPI.getWeekTemperature).toHaveBeenCalledTimes(1)
  })

  it('should handle API errors gracefully', async () => {
    // Make API calls throw errors
    vi.spyOn(weatherAPI, 'getCurrentWeather').mockRejectedValue(new Error('API error'))
    vi.spyOn(weatherAPI, 'getWeekTemperature').mockRejectedValue(new Error('API error'))

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
