import type { HourlyValues, HourlyUnits } from '@/types/hourly.types'

export interface DailyRequestParams {
  latitude: number
  longitude: number
  timezone: 'auto'
  wind_speed_unit: 'ms'
  hourly: string
  daily: string
  start_date: string
  end_date: string
}
export interface DailyResponse {
  daily: DailyValues
  daily_units: DailyUnits
  hourly: HourlyValues
  hourly_units: HourlyUnits
}

export interface DailyValues {
  rain_sum: number[]
  relative_humidity_2m_max: number[]
  showers_sum: number[]
  snowfall_sum: number[]
  surface_pressure_max: number[]
  time: string[]
  weather_code: number[]
  wind_direction_10m_dominant: number[]
  wind_gusts_10m_max: number[]
  wind_speed_10m_max: number[]
}

export type DailyUnits = {
  [K in keyof DailyValues]: string
}
