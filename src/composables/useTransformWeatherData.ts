import dayjs from 'dayjs'
import { getAvg } from '@/helpers/number.helpers'
import type { CurrentResponse } from '@/types/api/current.types'
import type { DailyResponse } from '@/types/api/daily.types'
import type { Weather, WeekTemperatures } from '@/types/weather.types'
import type { WeekResponse } from '@/types/api/week.types'

const useWeatherTransform = () => {
  const transformWeekTemperaturesData = (data: WeekResponse): WeekTemperatures => ({
    dates: data.daily.time.map((date) => dayjs(date).format('DD/MM')),
    temperatures: {
      values: data.daily.temperature_2m_max.map((temp) => Math.round(temp)),
      unit: data.daily_units.temperature_2m_max,
    },
  })

  const transformCurrentWeatherData = (data: CurrentResponse): Weather => ({
    date: data.current.time,
    temperature: {
      detail: {
        value: Math.round(data.current.temperature_2m),
        unit: data.current_units.temperature_2m,
      },
    },
    feelsLike: {
      detail: {
        value: Math.round(data.current.apparent_temperature),
        unit: data.current_units.apparent_temperature,
      },
    },
    windSpeed: {
      detail: { value: data.current.wind_speed_10m, unit: data.current_units.wind_speed_10m },
    },
    windGust: {
      detail: { value: data.current.wind_gusts_10m, unit: data.current_units.wind_gusts_10m },
    },
    windDirection: {
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
    weatherCode: data.current.weather_code,
    weatherDescription: getWeatherDescription(data.current.weather_code),
    isDay: !!data.current.is_day,
    rain: { detail: { value: data.current.rain, unit: data.current_units.rain } },
    showers: { detail: { value: data.current.showers, unit: data.current_units.showers } },
    snowfall: { detail: { value: data.current.snowfall, unit: data.current_units.snowfall } },
  })

  const transformDailyWeatherData = (data: DailyResponse): Weather => ({
    date: data.daily.time[0],
    temperature: {
      detail: {
        value: Math.round(getAvg(data.hourly.temperature_2m)),
        unit: data.hourly_units.temperature_2m,
      },
    },
    feelsLike: {
      detail: {
        value: Math.round(getAvg(data.hourly.apparent_temperature)),
        unit: data.hourly_units.apparent_temperature,
      },
    },
    windSpeed: {
      detail: {
        value: data.daily.wind_speed_10m_max[0],
        unit: data.daily_units.wind_speed_10m_max,
      },
    },
    windGust: {
      detail: {
        value: data.daily.wind_gusts_10m_max[0],
        unit: data.daily_units.wind_gusts_10m_max,
      },
    },
    windDirection: {
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
    weatherCode: data.daily.weather_code[0],
    weatherDescription: getWeatherDescription(data.daily.weather_code[0]),
    isDay: true,
    rain: { detail: { value: data.daily.rain_sum[0], unit: data.daily_units.rain_sum } },
    showers: { detail: { value: data.daily.showers_sum[0], unit: data.daily_units.showers_sum } },
    snowfall: {
      detail: { value: data.daily.snowfall_sum[0], unit: data.daily_units.snowfall_sum },
    },
  })

  return {
    transformWeekTemperaturesData,
    transformCurrentWeatherData,
    transformDailyWeatherData,
  }
}

export default useWeatherTransform

/**
 * Get weather description from WMO weather code
 * @param code WMO weather code
 * @returns Weather description string
 */
const getWeatherDescription = (code: Weather['weatherCode']): string => {
  const weatherCodeDescrMap: Record<Weather['weatherCode'], Weather['weatherDescription']> = {
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
