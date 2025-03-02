export interface HourlyValues {
  temperature_2m: number[]
  apparent_temperature: number[]
}

export type HourlyUnits = {
  [K in keyof HourlyValues]: string
}
