export type Lang = "fa" | "en";
export type Unit = "metric" | "imperial";

export interface GeoResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export interface HourPoint {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  uvIndex: number;
}

export interface DayPoint {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherBundle {
  current: CurrentWeather;
  hourly: HourPoint[];
  daily: DayPoint[];
}

export type Status = "idle" | "loading" | "error" | "success";
