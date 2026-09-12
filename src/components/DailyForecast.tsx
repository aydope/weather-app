import { WeatherIcon } from "@/components/WeatherIcon";
import { weatherMeta } from "@/lib/weatherMeta";
import { celsiusToUnit, formatWeekday, localizeDigits, unitSuffix } from "@/lib/format";
import type { DayPoint, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface DailyForecastProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  days: DayPoint[];
}

export function DailyForecast({ lang, unit, displayFont, days }: DailyForecastProps) {
  const allTemps = days.flatMap((d) => [celsiusToUnit(d.tempMin, unit), celsiusToUnit(d.tempMax, unit)]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const span = Math.max(1, globalMax - globalMin);

  return (
    <section className="mt-6 sm:mt-8">
      <h3 className={`${displayFont} text-lg sm:text-xl font-medium mb-3`}>{t(lang, "dailyTitle")}</h3>
      <div className="rounded-2xl border border-line bg-white/[0.035] divide-y divide-line">
        {days.map((d, i) => {
          const meta = weatherMeta(d.weatherCode, lang);
          const min = celsiusToUnit(d.tempMin, unit);
          const max = celsiusToUnit(d.tempMax, unit);
          const left = ((min - globalMin) / span) * 100;
          const width = Math.max(6, ((max - min) / span) * 100);
          return (
            <div
              key={d.date}
              className="flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-3.5"
            >
              <span className="w-16 sm:w-20 text-sm text-paper shrink-0">
                {formatWeekday(d.date, lang, i)}
              </span>
              <WeatherIcon group={meta.group} isDay={true} className="w-7 h-7 shrink-0" />
              <span className="w-9 text-sm text-mist text-end shrink-0">
                {localizeDigits(min, lang)}°
              </span>
              <div className="relative flex-1 h-1.5 rounded-full bg-white/[0.08] min-w-[60px]">
                <div
                  className="absolute h-1.5 rounded-full bg-gradient-to-r from-cyan to-amber"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </div>
              <span className="w-9 text-sm text-paper shrink-0">{localizeDigits(max, lang)}°</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-mist mt-2 text-end">{unitSuffix(unit)}</p>
    </section>
  );
}
