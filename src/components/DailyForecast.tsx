import { WeatherIcon } from "@/components/WeatherIcon";
import { Icon } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/section-title";
import { weatherMeta } from "@/lib/weatherMeta";
import {
  celsiusToUnit,
  formatWeekday,
  localizeDigits,
  unitSuffix,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DayPoint, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface DailyForecastProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  days: DayPoint[];
}

export function DailyForecast({
  lang,
  unit,
  displayFont,
  days,
}: DailyForecastProps) {
  const allTemps = days.flatMap((d) => [
    celsiusToUnit(d.tempMin, unit),
    celsiusToUnit(d.tempMax, unit),
  ]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const span = Math.max(1, globalMax - globalMin);

  return (
    <section id="forecast" className="mt-12 sm:mt-16 scroll-mt-24">
      <SectionTitle
        title={t(lang, "dailyTitle")}
        displayFont={displayFont}
        aside={
          <span className="text-xs text-mist shrink-0">{unitSuffix(unit)}</span>
        }
      />
      <div className="glass rounded-3xl divide-y divide-white/[0.07] overflow-hidden">
        {days.map((d, i) => {
          const meta = weatherMeta(d.weatherCode, lang);
          const min = celsiusToUnit(d.tempMin, unit);
          const max = celsiusToUnit(d.tempMax, unit);
          const left = ((min - globalMin) / span) * 100;
          const width = Math.max(6, ((max - min) / span) * 100);
          return (
            <div
              key={d.date}
              className={cn(
                "flex items-center gap-2.5 sm:gap-5 px-4 sm:px-7 py-4 transition-colors hover:bg-white/[0.03]",
                i === 0 && "bg-gold/[0.05]",
              )}
            >
              <div className="w-14 sm:w-20 shrink-0">
                <p className="text-sm text-paper">
                  {formatWeekday(d.date, lang, i)}
                </p>
                {d.precipProbabilityMax >= 10 && (
                  <p className="sm:hidden text-[11px] text-cyan mt-0.5">
                    {localizeDigits(d.precipProbabilityMax, lang)}%
                  </p>
                )}
              </div>
              <WeatherIcon
                group={meta.group}
                isDay={true}
                className="w-8 h-8 shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
              />
              <span
                className={cn(
                  "hidden sm:flex w-12 items-center gap-1 text-xs text-cyan shrink-0",
                  d.precipProbabilityMax < 10 && "invisible",
                )}
              >
                <Icon name="drop" className="w-3 h-3" />
                {localizeDigits(d.precipProbabilityMax, lang)}%
              </span>
              <span className="w-9 text-sm text-mist text-end shrink-0">
                {localizeDigits(min, lang)}°
              </span>
              <div className="relative flex-1 h-1.5 rounded-full bg-white/10 min-w-[60px]">
                <div
                  className="absolute h-1.5 rounded-full bg-gradient-to-r from-cyan to-gold"
                  style={{ insetInlineStart: `${left}%`, width: `${width}%` }}
                />
              </div>
              <span className="w-9 text-sm text-paper shrink-0">
                {localizeDigits(max, lang)}°
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
