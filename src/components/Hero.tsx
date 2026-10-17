import type { ReactNode } from "react";
import { WeatherIcon } from "@/components/WeatherIcon";
import { Icon, type IconName } from "@/components/ui/icons";
import { weatherMeta } from "@/lib/weatherMeta";
import {
  formatClock,
  formatLongDate,
  formatTemp,
  localizeDigits,
} from "@/lib/format";
import { CURRENT_LOCATION_ID } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { CurrentWeather, DayPoint, GeoResult, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface HeroProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  city: GeoResult;
  weather: CurrentWeather;
  today: DayPoint;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
}

function Tile({
  icon,
  label,
  children,
}: {
  icon: IconName;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="tile rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-3">
      <p className="flex items-center gap-2 text-mist text-xs">
        <Icon name={icon} className="w-4 h-4 text-gold" />
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

const iconButton =
  "grid place-items-center h-10 w-10 rounded-full border border-gold/25 bg-white/5 text-mist transition-colors hover:text-paper hover:bg-white/10 hover:border-gold/50";

export function Hero({
  lang,
  unit,
  displayFont,
  city,
  weather,
  today,
  isFavorite,
  onToggleFavorite,
  onRefresh,
}: HeroProps) {
  const meta = weatherMeta(weather.weatherCode, lang);
  const isCurrentLocation = city.id === CURRENT_LOCATION_ID;
  const cityName = isCurrentLocation ? t(lang, "myLocation") : city.name;
  const region = [city.admin1, city.country].filter(Boolean).join(", ");
  const favoriteLabel = t(lang, isFavorite ? "removeFavorite" : "addFavorite");

  return (
    <section id="overview" className="scroll-mt-24">
      <div className="glass glass-strong rounded-[32px] p-6 sm:p-10 grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-8 md:gap-10">
        <div className="flex flex-col justify-between gap-8 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {region && (
                <p className="flex items-center gap-1.5 text-mist text-sm">
                  <Icon name="pin" className="w-4 h-4 text-gold shrink-0" />
                  <span className="truncate">{region}</span>
                </p>
              )}
              <h2
                className={`${displayFont} text-4xl sm:text-5xl font-semibold leading-tight mt-2 truncate`}
              >
                {cityName}
              </h2>
              <p className="text-mist text-sm mt-1">
                {formatLongDate(weather.time, lang)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isCurrentLocation && (
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  aria-pressed={isFavorite}
                  aria-label={favoriteLabel}
                  title={favoriteLabel}
                  className={cn(
                    iconButton,
                    isFavorite && "text-gold border-gold/60 bg-gold/10",
                  )}
                >
                  <Icon
                    name="star"
                    filled={isFavorite}
                    className="w-[18px] h-[18px]"
                  />
                </button>
              )}
              <button
                type="button"
                onClick={onRefresh}
                aria-label={t(lang, "refresh")}
                title={t(lang, "refresh")}
                className={iconButton}
              >
                <Icon name="refresh" className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-8">
            <WeatherIcon
              group={meta.group}
              isDay={weather.isDay}
              className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 drop-shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
            />
            <div>
              <div
                className={`${displayFont} text-7xl sm:text-8xl font-light leading-none tracking-tight`}
              >
                {formatTemp(weather.temperature, unit, lang)}
              </div>
              <p className="text-gold-soft text-base sm:text-lg mt-3">
                {meta.label}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 auto-rows-fr gap-3">
          <Tile icon="thermometer" label={t(lang, "feelsLike")}>
            <p className={`${displayFont} text-2xl sm:text-3xl`}>
              {formatTemp(weather.apparentTemperature, unit, lang)}
            </p>
          </Tile>
          <Tile icon="sun" label={t(lang, "highLow")}>
            <p className={`${displayFont} text-xl sm:text-3xl`}>
              {formatTemp(today.tempMax, unit, lang)}
              <span className="text-mist text-base sm:text-xl"> / </span>
              {formatTemp(today.tempMin, unit, lang)}
            </p>
          </Tile>
          <Tile icon="umbrella" label={t(lang, "rainChance")}>
            <p className={`${displayFont} text-2xl sm:text-3xl`}>
              {localizeDigits(today.precipProbabilityMax, lang)}%
            </p>
          </Tile>
          <Tile icon="clock" label={t(lang, "updated")}>
            <p className={`${displayFont} text-2xl sm:text-3xl`}>
              {formatClock(weather.time, lang)}
            </p>
          </Tile>
        </div>
      </div>
    </section>
  );
}
