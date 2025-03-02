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
  feelsLike: WeatherDetail
  windSpeed: WeatherDetail
  windGust: WeatherDetail
  windDirection: WeatherDetail
  humidity: WeatherDetail
  pressure: WeatherDetail
  weatherCode: number
  weatherDescription: string
  isDay: boolean
  rain: WeatherDetail
  showers: WeatherDetail
  snowfall: WeatherDetail
}
