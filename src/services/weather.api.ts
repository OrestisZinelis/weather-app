import axios from 'axios'
import type {
  Weather,
  GetCurrentWeatherParams,
  GetDailyWeatherParams,
  GetTemperatureForecastParams,
  TemperatureForecast,
} from '@/types/weather.types'

const API_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Get weather max temperature data for next 7 days
 * Returns a date and temperature data
 *
 * @param params Weather parameters including latitude, longitude
 * @returns Promise with normalized weather data
 */
export const getTemperatureForcast = async ({
  latitude,
  longitude,
}: GetTemperatureForecastParams): Promise<TemperatureForecast> => {
  try {
    const requestParams = {
      latitude,
      longitude,
      timezone: 'auto',
      wind_speed_unit: 'ms',
      daily: 'temperature_2m_max',
    }

    const response = await axios.get(API_URL, {
      params: requestParams,
    })

    const data = response.data

    const dailyUnits = data.daily_units

    return {
      dates: data.daily.time,
      temperatures: {
        values: data.daily.temperature_2m_max,
        unit: dailyUnits.temperature_2m_max,
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
}: GetCurrentWeatherParams): Promise<Weather> => {
  try {
    const requestParams = {
      latitude,
      longitude,
      timezone: 'auto',
      wind_speed_unit: 'ms',
      current: [
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
      ].join(','),
    }

    const response = await axios.get(API_URL, { params: requestParams })
    const data = response.data
    const currentUnits = data.current_units

    return {
      date: data.current.time,
      temperature: {
        detail: { value: data.current.temperature_2m, unit: currentUnits.temperature_2m },
      },
      feels_like: {
        detail: {
          value: data.current.apparent_temperature,
          unit: currentUnits.apparent_temperature,
        },
      },
      wind_speed: {
        detail: { value: data.current.wind_speed_10m, unit: currentUnits.wind_speed_10m },
      },
      wind_gust: {
        detail: { value: data.current.wind_gusts_10m, unit: currentUnits.wind_gusts_10m },
      },
      wind_direction: {
        detail: { value: data.current.wind_direction_10m, unit: currentUnits.wind_direction_10m },
      },
      humidity: {
        detail: {
          value: data.current.relative_humidity_2m,
          unit: currentUnits.relative_humidity_2m,
        },
      },
      pressure: {
        detail: { value: data.current.surface_pressure, unit: currentUnits.surface_pressure },
      },
      weather_code: data.current.weather_code,
      weather_description: getWeatherDescription(data.current.weather_code),
      is_day: !!data.current.is_day,
      rain: { detail: { value: data.current.rain, unit: currentUnits.rain } },
      showers: { detail: { value: data.current.showers, unit: currentUnits.showers } },
      snowfall: { detail: { value: data.current.snowfall, unit: currentUnits.snowfall } },
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
}: GetDailyWeatherParams): Promise<Weather> => {
  try {
    const requestParams = {
      latitude,
      longitude,
      timezone: 'auto',
      wind_speed_unit: 'ms',
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant',
        'relative_humidity_2m_max',
        'surface_pressure_max',
        'weather_code',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
      ].join(','),
      start_date: date,
      end_date: date,
    }

    const response = await axios.get(API_URL, { params: requestParams })
    const data = response.data
    const dailyUnits = data.daily_units

    return {
      date: data.daily.time[0],
      temperature: {
        detail: {
          value: (data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2,
          unit: dailyUnits.temperature_2m_max,
        },
      },
      feels_like: {
        detail: {
          value:
            (data.daily.apparent_temperature_max[0] + data.daily.apparent_temperature_min[0]) / 2,
          unit: dailyUnits.apparent_temperature_max,
        },
      },
      wind_speed: {
        detail: { value: data.daily.wind_speed_10m_max[0], unit: dailyUnits.wind_speed_10m_max },
      },
      wind_gust: {
        detail: { value: data.daily.wind_gusts_10m_max[0], unit: dailyUnits.wind_gusts_10m_max },
      },
      wind_direction: {
        detail: {
          value: data.daily.wind_direction_10m_dominant[0],
          unit: dailyUnits.wind_direction_10m_dominant,
        },
      },
      humidity: {
        detail: {
          value: data.daily.relative_humidity_2m_max[0],
          unit: dailyUnits.relative_humidity_2m_max,
        },
      },
      pressure: {
        detail: {
          value: data.daily.surface_pressure_max[0],
          unit: dailyUnits.surface_pressure_max,
        },
      },
      weather_code: data.daily.weather_code[0],
      weather_description: getWeatherDescription(data.daily.weather_code[0]),
      is_day: true,
      rain: { detail: { value: data.daily.rain_sum[0], unit: dailyUnits.rain_sum } },
      showers: { detail: { value: data.daily.showers_sum[0], unit: dailyUnits.showers_sum } },
      snowfall: { detail: { value: data.daily.snowfall_sum[0], unit: dailyUnits.snowfall_sum } },
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
