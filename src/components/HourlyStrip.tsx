import { WeatherIcon } from "@/components/WeatherIcon";
import { HourlyChart } from "@/components/HourlyChart";
import { Icon } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/section-title";
import { weatherMeta } from "@/lib/weatherMeta";
import { formatHour, formatTemp, localizeDigits } from "@/lib/format";
import { useDragScroll } from "@/lib/useDragScroll";
import { cn } from "@/lib/utils";
import type { HourPoint, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface HourlyStripProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  hours: HourPoint[];
}

export function HourlyStrip({
  lang,
  unit,
  displayFont,
  hours,
}: HourlyStripProps) {
  const dragRef = useDragScroll<HTMLDivElement>();

  return (
    <section id="hourly" className="mt-12 sm:mt-16 scroll-mt-24">
      <SectionTitle title={t(lang, "hourlyTitle")} displayFont={displayFont} />
      <div
        ref={dragRef}
        className="drag-scroll flex gap-3 overflow-x-auto scroll-quiet pb-3 pt-1 -mx-1 px-1"
      >
        {hours.map((h, i) => {
          const meta = weatherMeta(h.weatherCode, lang);
          return (
            <div
              key={h.time}
              className={cn(
                "glass glass-hover flex flex-col items-center gap-2.5 rounded-3xl px-4 py-4 min-w-[82px] shrink-0",
                i === 0 && "border-gold/50",
              )}
            >
              <span
                className={cn(
                  "text-xs",
                  i === 0 ? "text-gold-soft" : "text-mist",
                )}
              >
                {i === 0 ? t(lang, "now") : formatHour(h.time, lang)}
              </span>
              <WeatherIcon
                group={meta.group}
                isDay={h.isDay}
                className="w-8 h-8"
              />
              <span className={`${displayFont} text-lg`}>
                {formatTemp(h.temperature, unit, lang)}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[11px] text-cyan",
                  h.precipProbability < 10 && "invisible",
                )}
              >
                <Icon name="drop" className="w-3 h-3" />
                {localizeDigits(h.precipProbability, lang)}%
              </span>
            </div>
          );
        })}
      </div>
      <HourlyChart lang={lang} unit={unit} hours={hours} />
    </section>
  );
}
