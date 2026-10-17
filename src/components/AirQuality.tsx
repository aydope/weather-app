import { SectionTitle } from "@/components/ui/section-title";
import { aqiCategory } from "@/lib/airQuality";
import { localizeDigits } from "@/lib/format";
import type { AirQuality as AirQualityData, Lang } from "@/types";
import { t } from "@/i18n";

interface AirQualityProps {
  lang: Lang;
  displayFont: string;
  air: AirQualityData;
}

const GAUGE_RADIUS = 80;
const GAUGE_MAX_AQI = 300;

const pollutants: {
  key: keyof Omit<AirQualityData, "usAqi">;
  label: string;
}[] = [
  { key: "pm25", label: "PM2.5" },
  { key: "pm10", label: "PM10" },
  { key: "no2", label: "NO2" },
  { key: "o3", label: "O3" },
  { key: "so2", label: "SO2" },
  { key: "co", label: "CO" },
];

export function AirQuality({ lang, displayFont, air }: AirQualityProps) {
  const category = aqiCategory(air.usAqi);
  const label = t(
    lang,
    `aqi${category.key.charAt(0).toUpperCase()}${category.key.slice(1)}`,
  );
  const note = t(
    lang,
    `aqiNote${category.key.charAt(0).toUpperCase()}${category.key.slice(1)}`,
  );

  const fraction = Math.min(1, air.usAqi / GAUGE_MAX_AQI);
  const angle = Math.PI - fraction * Math.PI;
  const marker = {
    x: 100 + GAUGE_RADIUS * Math.cos(angle),
    y: 100 - GAUGE_RADIUS * Math.sin(angle),
  };
  const arc = `M ${100 - GAUGE_RADIUS} 100 A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${100 + GAUGE_RADIUS} 100`;

  return (
    <section id="air" className="mt-12 sm:mt-16 scroll-mt-24">
      <SectionTitle
        title={t(lang, "airTitle")}
        displayFont={displayFont}
        aside={<span className="text-xs text-mist shrink-0">US AQI</span>}
      />
      <div className="glass rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-10 items-center">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full max-w-[260px]">
            <svg viewBox="0 0 200 112" className="w-full" aria-hidden="true">
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#7BC8A4" />
                  <stop offset="0.25" stopColor="#E5C567" />
                  <stop offset="0.42" stopColor="#E39A5C" />
                  <stop offset="0.58" stopColor="#E0695F" />
                  <stop offset="0.8" stopColor="#B07AD8" />
                  <stop offset="1" stopColor="#A33A5A" />
                </linearGradient>
              </defs>
              <path
                d={arc}
                stroke="url(#aqiGradient)"
                strokeOpacity="0.28"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={arc}
                stroke="url(#aqiGradient)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${Math.max(fraction * 100, 1)} 100`}
              />
              <circle
                cx={marker.x}
                cy={marker.y}
                r="9"
                fill={category.color}
                opacity="0.25"
              />
              <circle
                cx={marker.x}
                cy={marker.y}
                r="5"
                fill="#07080C"
                stroke={category.color}
                strokeWidth="2.5"
              />
            </svg>
            <p
              className={`${displayFont} absolute inset-x-0 bottom-0 text-5xl font-light leading-none`}
            >
              {localizeDigits(air.usAqi, lang)}
            </p>
          </div>
          <p
            className="mt-5 flex items-center gap-2 text-base"
            style={{ color: category.color }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {label}
          </p>
          <p className="text-mist text-sm leading-7 mt-2 max-w-xs">{note}</p>
        </div>

        <div>
          <p className="text-xs text-mist mb-3">
            {t(lang, "pollutants")} <span dir="ltr">(µg/m³)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pollutants.map((p) => (
              <div key={p.key} className="tile rounded-2xl p-4">
                <p className="text-xs text-mist" dir="ltr">
                  {p.label}
                </p>
                <p className={`${displayFont} text-2xl mt-2`}>
                  {air[p.key] === null
                    ? "-"
                    : localizeDigits(air[p.key] as number, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
