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
  windGusts: number;
  visibility: number;
  cloudCover: number;
  dewPoint: number;
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
  precipProbability: number;
}

export interface DayPoint {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipSum: number;
  precipProbabilityMax: number;
}

export interface AirQuality {
  usAqi: number;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  so2: number | null;
  co: number | null;
}

export interface WeatherBundle {
  current: CurrentWeather;
  hourly: HourPoint[];
  daily: DayPoint[];
  air: AirQuality | null;
}

export type Status = "idle" | "loading" | "error" | "success";
