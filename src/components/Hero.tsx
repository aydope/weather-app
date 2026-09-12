import { WeatherIcon } from "@/components/WeatherIcon";
import { SunArc } from "@/components/SunArc";
import { weatherMeta } from "@/lib/weatherMeta";
import { formatClock, formatTemp } from "@/lib/format";
import type { CurrentWeather, DayPoint, GeoResult, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface HeroProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  city: GeoResult;
  weather: CurrentWeather;
  today: DayPoint;
  tomorrow?: DayPoint;
}

export function Hero({ lang, unit, displayFont, city, weather, today, tomorrow }: HeroProps) {
  const meta = weatherMeta(weather.weatherCode, lang);

  return (
    <div className="rounded-[28px] border border-line bg-white/[0.045] backdrop-blur-md px-6 sm:px-10 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-6 items-center">
      <div>
        <p className="text-mist text-sm mb-1">
          {[city.admin1, city.country].filter(Boolean).join(", ")}
        </p>
        <h2 className={`${displayFont} text-3xl sm:text-4xl font-medium mb-4`}>{city.name}</h2>

        <div className="flex items-center gap-5 sm:gap-6">
          <WeatherIcon group={meta.group} isDay={weather.isDay} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
          <div>
            <div className={`${displayFont} text-6xl sm:text-7xl font-light leading-none tracking-tight`}>
              {formatTemp(weather.temperature, unit, lang)}
            </div>
            <p className="text-cyan text-sm sm:text-base mt-2">{meta.label}</p>
          </div>
        </div>

        <p className="text-mist text-sm mt-5">
          {t(lang, "feelsLike")} {formatTemp(weather.apparentTemperature, unit, lang)} ·{" "}
          {t(lang, "updated")} {formatClock(weather.time, lang)}
        </p>
      </div>

      <div className="flex justify-center md:justify-end">
        <SunArc
          lang={lang}
          sunrise={today.sunrise}
          sunset={today.sunset}
          nextSunrise={tomorrow?.sunrise}
          now={weather.time}
          isDay={weather.isDay}
          labelSunrise={t(lang, "sunrise")}
          labelSunset={t(lang, "sunset")}
        />
      </div>
    </div>
  );
}
