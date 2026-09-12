import type { CurrentWeather, DayPoint, GeoResult, HourPoint, WeatherBundle } from "@/types";

export async function searchCities(query: string): Promise<GeoResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("geo_failed");
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function fetchWeatherBundle(
  lat: number,
  lon: number
): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure",
    hourly: "temperature_2m,weather_code,is_day,uv_index",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
    forecast_days: "7",
    timezone: "auto",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather_failed");
  const data = await res.json();

  const c = data.current;
  const current: CurrentWeather = {
    temperature: Math.round(c.temperature_2m),
    apparentTemperature: Math.round(c.apparent_temperature),
    humidity: Math.round(c.relative_humidity_2m),
    windSpeed: Math.round(c.wind_speed_10m),
    windDirection: c.wind_direction_10m,
    pressure: Math.round(c.surface_pressure),
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    time: c.time,
  };

  const nowIndex = data.hourly.time.findIndex((t: string) => t === data.current.time) ?? 0;
  const startIndex = Math.max(nowIndex, 0);
  const hourly: HourPoint[] = data.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((t: string, i: number) => ({
      time: t,
      temperature: Math.round(data.hourly.temperature_2m[startIndex + i]),
      weatherCode: data.hourly.weather_code[startIndex + i],
      isDay: data.hourly.is_day[startIndex + i] === 1,
      uvIndex: data.hourly.uv_index[startIndex + i],
    }));

  const daily: DayPoint[] = data.daily.time.map((d: string, i: number) => ({
    date: d,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    uvIndexMax: data.daily.uv_index_max[i],
  }));

  return { current, hourly, daily };
}
