export interface CurrentRequestParams {
  latitude: number
  longitude: number
  timezone: 'auto'
  wind_speed_unit: 'ms'
  current: string
}

export interface CurrentResponse {
  current: CurrentValues
  current_units: CurrentUnits
}

export interface CurrentValues {
  time: string
  interval: number
  temperature_2m: number
  apparent_temperature: number
  wind_speed_10m: number
  wind_gusts_10m: number
  wind_direction_10m: number
  surface_pressure: number
  weather_code: number
  is_day: number
  rain: number
  relative_humidity_2m: number
  showers: number
  snowfall: number
}

export type CurrentUnits = {
  [K in keyof CurrentValues]: string
}
