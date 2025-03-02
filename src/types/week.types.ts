export interface WeekRequestParams {
  latitude: number
  longitude: number
  timezone: 'auto'
  wind_speed_unit: 'ms'
  daily: 'temperature_2m_max'
}

export interface WeekResponse {
  daily: WeekDailyValues
  daily_units: WeekDailyUnits
}

export interface WeekDailyValues {
  temperature_2m_max: number[]
  time: string[]
}

export type WeekDailyUnits = {
  [K in keyof WeekDailyValues]: string
}
