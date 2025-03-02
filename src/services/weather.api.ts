import axios from 'axios'
import dayjs from 'dayjs'
import type { WeekRequestParams, WeekResponse } from '@/types/api/week.types'
import type { DailyRequestParams, DailyResponse, DailyValues } from '@/types/api/daily.types'
import type {
  CurrentRequestParams,
  CurrentResponse,
  CurrentValues,
} from '@/types/api/current.types'
import type { HourlyValues } from '@/types/api/hourly.types'

const API_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Get weather max temperature data for next 7 days
 * Returns WeekResponse object
 *
 * @param params Weather parameters including latitude, longitude
 * @returns Promise with weather data
 */
export const getWeekTemperature = async ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}): Promise<WeekResponse> => {
  try {
    const requestParams: WeekRequestParams = {
      latitude,
      longitude,
      timezone: 'auto',
      wind_speed_unit: 'ms',
      daily: 'temperature_2m_max',
    }

    const response = await axios.get<WeekResponse>(API_URL, {
      params: requestParams,
    })

    const data = response.data

    return data
  } catch (error) {
    console.error('Failed to fetch weather data:', error)
    throw error
  }
}

/**
 * Get weather data for current conditions
 * Returns a CurrentResponse object
 *
 * @param params latitude, longitude
 * @returns Promise with weather data
 */
export const getCurrentWeather = async ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}): Promise<CurrentResponse> => {
  try {
    const requestParams: CurrentRequestParams = {
      latitude,
      longitude,
      timezone: 'auto',
      wind_speed_unit: 'ms',
      current: (
        [
          'temperature_2m',
          'apparent_temperature',
          'wind_speed_10m',
          'wind_gusts_10m',
          'wind_direction_10m',
          'relative_humidity_2m',
          'surface_pressure',
          'weather_code',
          'is_day',
          'rain',
          'showers',
          'snowfall',
        ] satisfies (keyof CurrentValues)[]
      ).join(','),
    }

    const response = await axios.get<CurrentResponse>(API_URL, { params: requestParams })
    const data = response.data

    return data
  } catch (error) {
    console.error('Failed to fetch current weather:', error)
    throw error
  }
}

/**
 * Get weather data for a specific date
 * Returns a DailyResponset object
 * @param params latitude, longitude and date
 * @returns Promise with weather data
 */
export const getDailyWeather = async ({
  latitude,
  longitude,
  date,
}: {
  latitude: number
  longitude: number
  date: string
}): Promise<DailyResponse> => {
  try {
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const requestParams: DailyRequestParams = {
      latitude,
      longitude,
      timezone: 'auto',
      wind_speed_unit: 'ms',
      hourly: (['temperature_2m', 'apparent_temperature'] satisfies (keyof HourlyValues)[]).join(
        ',',
      ),
      daily: (
        [
          'wind_speed_10m_max',
          'wind_gusts_10m_max',
          'wind_direction_10m_dominant',
          'relative_humidity_2m_max',
          'surface_pressure_max',
          'weather_code',
          'rain_sum',
          'showers_sum',
          'snowfall_sum',
        ] satisfies (keyof DailyValues)[]
      ).join(','),
      start_date: formattedDate,
      end_date: formattedDate,
    }

    const response = await axios.get<DailyResponse>(API_URL, { params: requestParams })
    const data = response.data

    return data
  } catch (error) {
    console.error('Failed to fetch daily weather:', error)
    throw error
  }
}
