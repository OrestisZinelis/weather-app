export interface WeekTemperatures {
  dates: string[]
  temperatures: WeekTemperaturesDetail
}
export interface WeekTemperaturesDetail {
  values: number[]
  unit: string
}

type WeatherDetailId = 'feels_like' | 'wind' | 'wind_gust' | 'wind_deg' | 'humidity' | 'pressure'

export interface WeatherDetail {
  id?: WeatherDetailId
  text?: string
  detail: {
    value: number
    unit: string
  }
}
export interface Weather {
  date: string
  temperature: WeatherDetail
  feels_like: WeatherDetail
  wind_speed: WeatherDetail
  wind_gust: WeatherDetail
  wind_direction: WeatherDetail
  humidity: WeatherDetail
  pressure: WeatherDetail
  weather_code: number
  weather_description: string
  is_day: boolean
  rain: WeatherDetail
  showers: WeatherDetail
  snowfall: WeatherDetail
}
