import type {
  AirQuality,
  CurrentWeather,
  DayPoint,
  GeoResult,
  HourPoint,
  Lang,
  WeatherBundle,
} from "@/types";

export async function searchCities(
  query: string,
  lang: Lang = "en",
): Promise<GeoResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query,
  )}&count=6&language=${lang}&format=json`;
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

const roundedOrNull = (value: unknown) =>
  typeof value === "number" ? Math.round(value) : null;

async function fetchAirQuality(
  lat: number,
  lon: number,
): Promise<AirQuality | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide",
    timezone: "auto",
  });
  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`,
  );
  if (!res.ok) throw new Error("air_failed");
  const c = (await res.json()).current;
  if (typeof c?.us_aqi !== "number") return null;
  return {
    usAqi: Math.round(c.us_aqi),
    pm25: roundedOrNull(c.pm2_5),
    pm10: roundedOrNull(c.pm10),
    no2: roundedOrNull(c.nitrogen_dioxide),
    o3: roundedOrNull(c.ozone),
    so2: roundedOrNull(c.sulphur_dioxide),
    co: roundedOrNull(c.carbon_monoxide),
  };
}

async function fetchForecast(
  lat: number,
  lon: number,
): Promise<Omit<WeatherBundle, "air">> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,visibility,cloud_cover,dew_point_2m",
    hourly:
      "temperature_2m,weather_code,is_day,uv_index,precipitation_probability",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max",
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
    windGusts: Math.round(c.wind_gusts_10m),
    pressure: Math.round(c.surface_pressure),
    visibility: c.visibility,
    cloudCover: Math.round(c.cloud_cover),
    dewPoint: Math.round(c.dew_point_2m),
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    time: c.time,
  };

  // current.time is on a 15 minute grid while hourly.time is on the hour, so match by hour.
  const nowHour = String(c.time).slice(0, 13);
  const nowIndex = data.hourly.time.findIndex(
    (t: string) => t.slice(0, 13) === nowHour,
  );
  const startIndex = Math.max(nowIndex, 0);
  const hourly: HourPoint[] = data.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((t: string, i: number) => ({
      time: t,
      temperature: Math.round(data.hourly.temperature_2m[startIndex + i]),
      weatherCode: data.hourly.weather_code[startIndex + i],
      isDay: data.hourly.is_day[startIndex + i] === 1,
      uvIndex: data.hourly.uv_index[startIndex + i],
      precipProbability:
        data.hourly.precipitation_probability[startIndex + i] ?? 0,
    }));

  const daily: DayPoint[] = data.daily.time.map((d: string, i: number) => ({
    date: d,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    uvIndexMax: data.daily.uv_index_max[i],
    precipSum: data.daily.precipitation_sum[i] ?? 0,
    precipProbabilityMax: data.daily.precipitation_probability_max[i] ?? 0,
  }));

  return { current, hourly, daily };
}

export async function fetchWeatherBundle(
  lat: number,
  lon: number,
): Promise<WeatherBundle> {
  const [forecast, air] = await Promise.all([
    fetchForecast(lat, lon),
    // Air quality is optional. A failure here must not block the forecast.
    fetchAirQuality(lat, lon).catch(() => null),
  ]);
  return { ...forecast, air };
}
