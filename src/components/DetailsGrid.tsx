import type { ReactNode } from "react";
import { WindCompass } from "@/components/WindCompass";
import { UvGauge } from "@/components/UvGauge";
import { Icon, type IconName } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/section-title";
import { formatPrecip, formatTemp, formatVisibility, localizeDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CurrentWeather, DayPoint, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface DetailsGridProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  weather: CurrentWeather;
  today: DayPoint;
}

interface DetailCardProps {
  icon: IconName;
  label: string;
  className?: string;
  children: ReactNode;
}

function DetailCard({ icon, label, className, children }: DetailCardProps) {
  return (
    <div className={cn("glass rounded-3xl p-4 sm:p-5 flex flex-col gap-4", className)}>
      <p className="flex items-center gap-2 text-mist text-xs sm:text-sm">
        <Icon name={icon} className="w-4 h-4 text-gold shrink-0" />
        {label}
      </p>
      <div className="mt-auto">{children}</div>
    </div>
  );
}

function Meter({ value }: { value: number }) {
  return (
    <div className="h-1.5 rounded-full bg-white/10 mt-3">
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold-deep"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function DetailsGrid({ lang, unit, displayFont, weather, today }: DetailsGridProps) {
  const valueClass = `${displayFont} text-xl sm:text-3xl`;

  return (
    <section id="details" aria-labelledby="details-title" className="mt-12 sm:mt-16 scroll-mt-24">
      <SectionTitle id="details-title" title={t(lang, "detailsTitle")} displayFont={displayFont} />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
        <DetailCard icon="wind" label={t(lang, "wind")} className="col-span-2 md:col-span-3">
          <WindCompass
            lang={lang}
            unit={unit}
            displayFont={displayFont}
            speed={weather.windSpeed}
            direction={weather.windDirection}
            gusts={weather.windGusts}
          />
        </DetailCard>

        <DetailCard icon="sun" label={t(lang, "uv")} className="col-span-2 md:col-span-3">
          <UvGauge lang={lang} displayFont={displayFont} uv={today.uvIndexMax} />
        </DetailCard>

        <DetailCard icon="drop" label={t(lang, "humidity")} className="md:col-span-2">
          <p className={valueClass}>{localizeDigits(weather.humidity, lang)}%</p>
          <Meter value={weather.humidity} />
        </DetailCard>

        <DetailCard icon="gauge" label={t(lang, "pressure")} className="md:col-span-2">
          <p className={valueClass}>
            {localizeDigits(weather.pressure, lang)}
            <span className="text-sm text-mist ms-1 font-body">hPa</span>
          </p>
        </DetailCard>

        <DetailCard icon="eye" label={t(lang, "visibility")} className="md:col-span-2">
          <p className={valueClass}>{formatVisibility(weather.visibility, unit, lang)}</p>
        </DetailCard>

        <DetailCard icon="cloud" label={t(lang, "cloudCover")} className="md:col-span-2">
          <p className={valueClass}>{localizeDigits(weather.cloudCover, lang)}%</p>
          <Meter value={weather.cloudCover} />
        </DetailCard>

        <DetailCard icon="thermometer" label={t(lang, "dewPoint")} className="md:col-span-2">
          <p className={valueClass}>{formatTemp(weather.dewPoint, unit, lang)}</p>
        </DetailCard>

        <DetailCard icon="umbrella" label={t(lang, "precipitation")} className="md:col-span-2">
          <p className={valueClass}>{formatPrecip(today.precipSum, unit, lang)}</p>
        </DetailCard>
      </div>
    </section>
  );
}
