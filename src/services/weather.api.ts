import axios from 'axios'
import dayjs from 'dayjs'
import { getAvg } from '@/helpers/number.helpers'
import type { WeekRequestParams, WeekResponse } from '@/types/week.types'
import type { DailyRequestParams, DailyResponse, DailyValues } from '@/types/daily.types'
import type { CurrentRequestParams, CurrentResponse, CurrentValues } from '@/types/current.types'
import type { HourlyValues } from '@/types/hourly.types'

import type { Weather, WeekTemperatures } from '@/types/weather.types'

const API_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Get weather max temperature data for next 7 days
 * Returns a date and temperature data
 *
 * @param params Weather parameters including latitude, longitude
 * @returns Promise with normalized weather data
 */
export const getWeekTemperature = async ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}): Promise<WeekTemperatures> => {
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

    return {
      dates: data.daily.time.map((date) => dayjs(date).format('DD/MM')),
      temperatures: {
        values: data.daily.temperature_2m_max.map((temp) => Math.round(temp)),
        unit: data.daily_units.temperature_2m_max,
      },
    }
  } catch (error) {
    console.error('Failed to fetch weather data:', error)
    throw error
  }
}

/**
 * Get weather data for current conditions
 * Returns a consistent object structure
 *
 * @param params latitude, longitude
 * @returns Promise with normalized weather data
 */
export const getCurrentWeather = async ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}): Promise<Weather> => {
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

    return {
      date: data.current.time,
      temperature: {
        detail: {
          value: Math.round(data.current.temperature_2m),
          unit: data.current_units.temperature_2m,
        },
      },
      feels_like: {
        detail: {
          value: Math.round(data.current.apparent_temperature),
          unit: data.current_units.apparent_temperature,
        },
      },
      wind_speed: {
        detail: { value: data.current.wind_speed_10m, unit: data.current_units.wind_speed_10m },
      },
      wind_gust: {
        detail: { value: data.current.wind_gusts_10m, unit: data.current_units.wind_gusts_10m },
      },
      wind_direction: {
        detail: {
          value: data.current.wind_direction_10m,
          unit: data.current_units.wind_direction_10m,
        },
      },
      humidity: {
        detail: {
          value: data.current.relative_humidity_2m,
          unit: data.current_units.relative_humidity_2m,
        },
      },
      pressure: {
        detail: { value: data.current.surface_pressure, unit: data.current_units.surface_pressure },
      },
      weather_code: data.current.weather_code,
      weather_description: getWeatherDescription(data.current.weather_code),
      is_day: !!data.current.is_day,
      rain: { detail: { value: data.current.rain, unit: data.current_units.rain } },
      showers: { detail: { value: data.current.showers, unit: data.current_units.showers } },
      snowfall: { detail: { value: data.current.snowfall, unit: data.current_units.snowfall } },
    }
  } catch (error) {
    console.error('Failed to fetch current weather:', error)
    throw error
  }
}

/**
 * Get weather data for a specific date
 * Returns a consistent object structure
 * @param params latitude, longitude and date
 * @returns Promise with normalized weather data
 */
export const getDailyWeather = async ({
  latitude,
  longitude,
  date,
}: {
  latitude: number
  longitude: number
  date: string
}): Promise<Weather> => {
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

    return {
      date: data.daily.time[0],
      temperature: {
        detail: {
          value: Math.round(getAvg(data.hourly.temperature_2m)),
          unit: data.hourly_units.temperature_2m,
        },
      },
      feels_like: {
        detail: {
          value: Math.round(getAvg(data.hourly.apparent_temperature)),
          unit: data.hourly_units.apparent_temperature,
        },
      },
      wind_speed: {
        detail: {
          value: data.daily.wind_speed_10m_max[0],
          unit: data.daily_units.wind_speed_10m_max,
        },
      },
      wind_gust: {
        detail: {
          value: data.daily.wind_gusts_10m_max[0],
          unit: data.daily_units.wind_gusts_10m_max,
        },
      },
      wind_direction: {
        detail: {
          value: data.daily.wind_direction_10m_dominant[0],
          unit: data.daily_units.wind_direction_10m_dominant,
        },
      },
      humidity: {
        detail: {
          value: data.daily.relative_humidity_2m_max[0],
          unit: data.daily_units.relative_humidity_2m_max,
        },
      },
      pressure: {
        detail: {
          value: data.daily.surface_pressure_max[0],
          unit: data.daily_units.surface_pressure_max,
        },
      },
      weather_code: data.daily.weather_code[0],
      weather_description: getWeatherDescription(data.daily.weather_code[0]),
      is_day: true,
      rain: { detail: { value: data.daily.rain_sum[0], unit: data.daily_units.rain_sum } },
      showers: { detail: { value: data.daily.showers_sum[0], unit: data.daily_units.showers_sum } },
      snowfall: {
        detail: { value: data.daily.snowfall_sum[0], unit: data.daily_units.snowfall_sum },
      },
    }
  } catch (error) {
    console.error('Failed to fetch daily weather:', error)
    throw error
  }
}

/**
 * Get weather description from WMO weather code
 * @param code WMO weather code
 * @returns Weather description string
 */
export const getWeatherDescription = (code: Weather['weather_code']): string => {
  const weatherCodeDescrMap: Record<Weather['weather_code'], Weather['weather_description']> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }

  return weatherCodeDescrMap[code] || 'Unknown'
}
