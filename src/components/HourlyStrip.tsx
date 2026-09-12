import { WeatherIcon } from "@/components/WeatherIcon";
import { weatherMeta } from "@/lib/weatherMeta";
import { formatHour, formatTemp } from "@/lib/format";
import type { HourPoint, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface HourlyStripProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  hours: HourPoint[];
}

export function HourlyStrip({ lang, unit, displayFont, hours }: HourlyStripProps) {
  return (
    <section className="mt-6 sm:mt-8">
      <h3 className={`${displayFont} text-lg sm:text-xl font-medium mb-3`}>{t(lang, "hourlyTitle")}</h3>
      <div className="flex gap-3 overflow-x-auto scroll-quiet pb-2 -mx-1 px-1">
        {hours.map((h, i) => {
          const meta = weatherMeta(h.weatherCode, lang);
          return (
            <div
              key={h.time}
              className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white/[0.035] px-4 py-4 min-w-[74px] shrink-0"
            >
              <span className="text-xs text-mist">{i === 0 ? t(lang, "now") : formatHour(h.time, lang)}</span>
              <WeatherIcon group={meta.group} isDay={h.isDay} className="w-8 h-8" />
              <span className={`${displayFont} text-base`}>{formatTemp(h.temperature, unit, lang)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
