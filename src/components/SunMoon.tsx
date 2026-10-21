import { SunArc } from "@/components/SunArc";
import { MoonDisc } from "@/components/MoonDisc";
import { Icon, type IconName } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/section-title";
import { formatDuration, localizeDigits } from "@/lib/format";
import { moonPhase } from "@/lib/moon";
import type { CurrentWeather, DayPoint, Lang } from "@/types";
import { t } from "@/i18n";

interface SunMoonProps {
  lang: Lang;
  displayFont: string;
  weather: CurrentWeather;
  today: DayPoint;
  tomorrow?: DayPoint;
}

function CardLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <p className="flex items-center gap-2 text-mist text-xs sm:text-sm mb-6">
      <Icon name={icon} className="w-4 h-4 text-gold" />
      {label}
    </p>
  );
}

export function SunMoon({ lang, displayFont, weather, today, tomorrow }: SunMoonProps) {
  const daylightMs = new Date(today.sunset).getTime() - new Date(today.sunrise).getTime();
  const moon = moonPhase(new Date(weather.time));

  return (
    <section id="sun" aria-labelledby="sun-title" className="mt-12 sm:mt-16 scroll-mt-24">
      <SectionTitle id="sun-title" title={t(lang, "sunMoonTitle")} displayFont={displayFont} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <CardLabel icon="sun" label={t(lang, "sunLabel")} />
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
          <p className="mt-6 pt-5 border-t border-white/[0.07] flex items-center justify-between text-sm">
            <span className="text-mist">{t(lang, "daylight")}</span>
            <span className={`${displayFont} text-xl`}>{formatDuration(daylightMs, lang)}</span>
          </p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8">
          <CardLabel icon="moon" label={t(lang, "moonLabel")} />
          <div className="flex items-center gap-4 sm:gap-8">
            <MoonDisc fraction={moon.fraction} className="w-24 h-24 sm:w-32 sm:h-32 shrink-0" />
            <div>
              <p className={`${displayFont} text-xl sm:text-3xl font-semibold`}>{t(lang, moon.nameKey)}</p>
              <p className="text-mist text-sm mt-3">{t(lang, "illumination")}</p>
              <p className={`${displayFont} text-3xl text-gold-soft`}>
                {localizeDigits(Math.round(moon.illumination * 100), lang)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
