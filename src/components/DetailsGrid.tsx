import { WindCompass } from "@/components/WindCompass";
import { UvGauge } from "@/components/UvGauge";
import { localizeDigits } from "@/lib/format";
import type { CurrentWeather, DayPoint, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface DetailsGridProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  weather: CurrentWeather;
  today: DayPoint;
}

export function DetailsGrid({ lang, unit, displayFont, weather, today }: DetailsGridProps) {
  return (
    <section className="mt-6 sm:mt-8">
      <h3 className={`${displayFont} text-lg sm:text-xl font-medium mb-3`}>{t(lang, "detailsTitle")}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-line bg-white/[0.035] px-4 sm:px-5 py-4 sm:py-5">
          <p className="text-mist text-xs sm:text-sm mb-3">{t(lang, "humidity")}</p>
          <p className={`${displayFont} text-2xl sm:text-3xl`}>{localizeDigits(weather.humidity, lang)}%</p>
        </div>

        <div className="rounded-2xl border border-line bg-white/[0.035] px-4 sm:px-5 py-4 sm:py-5">
          <p className="text-mist text-xs sm:text-sm mb-3">{t(lang, "wind")}</p>
          <WindCompass lang={lang} unit={unit} speed={weather.windSpeed} direction={weather.windDirection} />
        </div>

        <div className="rounded-2xl border border-line bg-white/[0.035] px-4 sm:px-5 py-4 sm:py-5">
          <p className="text-mist text-xs sm:text-sm mb-3">{t(lang, "uv")}</p>
          <UvGauge lang={lang} uv={today.uvIndexMax} />
        </div>

        <div className="rounded-2xl border border-line bg-white/[0.035] px-4 sm:px-5 py-4 sm:py-5">
          <p className="text-mist text-xs sm:text-sm mb-3">{t(lang, "pressure")}</p>
          <p className={`${displayFont} text-2xl sm:text-3xl`}>
            {localizeDigits(weather.pressure, lang)}
            <span className="text-sm text-mist ms-1">hPa</span>
          </p>
        </div>
      </div>
    </section>
  );
}
