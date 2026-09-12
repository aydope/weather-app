import { formatClock } from "@/lib/format";
import type { Lang } from "@/types";

interface SunArcProps {
  lang: Lang;
  sunrise: string;
  sunset: string;
  nextSunrise?: string;
  now: string;
  isDay: boolean;
  labelSunrise: string;
  labelSunset: string;
}

// Describes a point on a semicircle arc (180deg, left to right) for a given fraction 0..1
function pointOnArc(fraction: number, cx: number, cy: number, r: number) {
  const angle = Math.PI - fraction * Math.PI; // PI (left) -> 0 (right)
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
}

export function SunArc({
  lang,
  sunrise,
  sunset,
  nextSunrise,
  now,
  isDay,
  labelSunrise,
  labelSunset,
}: SunArcProps) {
  const nowMs = new Date(now).getTime();
  const sunriseMs = new Date(sunrise).getTime();
  const sunsetMs = new Date(sunset).getTime();

  let fraction: number;
  if (isDay) {
    fraction = (nowMs - sunriseMs) / (sunsetMs - sunriseMs);
  } else {
    const nextSunriseMs = nextSunrise
      ? new Date(nextSunrise).getTime()
      : sunsetMs + 12 * 60 * 60 * 1000;
    fraction = (nowMs - sunsetMs) / (nextSunriseMs - sunsetMs);
  }
  fraction = Math.min(1, Math.max(0, fraction));

  const cx = 100;
  const cy = 90;
  const r = 72;
  const marker = pointOnArc(fraction, cx, cy, r);
  const accent = isDay ? "#FFB648" : "#9C8CF5";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 100" className="w-full max-w-[220px]">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${marker.x} ${marker.y}`}
          stroke={accent}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={marker.x} cy={marker.y} r="6" fill={accent} />
        <circle cx={marker.x} cy={marker.y} r="10" fill={accent} opacity="0.25" />
      </svg>
      <div className="flex justify-between w-full max-w-[220px] -mt-1 text-xs text-mist">
        <div className="flex flex-col items-start">
          <span>{labelSunrise}</span>
          <span className="text-paper">{formatClock(sunrise, lang)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span>{labelSunset}</span>
          <span className="text-paper">{formatClock(sunset, lang)}</span>
        </div>
      </div>
    </div>
  );
}
