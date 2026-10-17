import type { AirQuality, CurrentWeather, DayPoint, HourPoint } from "@/types";
import type { IconName } from "@/components/ui/icons";

export type InsightTone = "good" | "warn" | "info";

export interface Insight {
  tip: string;
  tone: InsightTone;
  icon: IconName;
}

function dressInsight(feelsLikeC: number): Insight {
  if (feelsLikeC <= 0)
    return { tip: "tipDressHeavy", tone: "warn", icon: "shirt" };
  if (feelsLikeC <= 10)
    return { tip: "tipDressWarm", tone: "info", icon: "shirt" };
  if (feelsLikeC <= 18)
    return { tip: "tipDressLayers", tone: "info", icon: "shirt" };
  if (feelsLikeC <= 27)
    return { tip: "tipDressLight", tone: "good", icon: "shirt" };
  return { tip: "tipDressHot", tone: "warn", icon: "shirt" };
}

export function buildInsights(
  weather: CurrentWeather,
  today: DayPoint,
  hours: HourPoint[],
  air: AirQuality | null,
): Insight[] {
  const list: Insight[] = [];

  const rainChance = Math.max(0, ...hours.map((h) => h.precipProbability));
  if (rainChance >= 50)
    list.push({ tip: "tipUmbrella", tone: "warn", icon: "umbrella" });
  else if (rainChance < 20)
    list.push({ tip: "tipDry", tone: "good", icon: "umbrella" });

  if (today.uvIndexMax >= 6)
    list.push({ tip: "tipUvHigh", tone: "warn", icon: "sun" });
  else if (today.uvIndexMax >= 3)
    list.push({ tip: "tipUvModerate", tone: "info", icon: "sun" });

  list.push(dressInsight(weather.apparentTemperature));

  if (weather.windGusts >= 50)
    list.push({ tip: "tipWindStrong", tone: "warn", icon: "wind" });
  else if (weather.windGusts >= 30)
    list.push({ tip: "tipWindBreezy", tone: "info", icon: "wind" });

  if (air) {
    if (air.usAqi > 100)
      list.push({ tip: "tipAirPoor", tone: "warn", icon: "leaf" });
    else if (air.usAqi <= 50)
      list.push({ tip: "tipAirGood", tone: "good", icon: "leaf" });
  }

  if (weather.visibility < 2000)
    list.push({ tip: "tipLowVisibility", tone: "warn", icon: "eye" });

  return list;
}
