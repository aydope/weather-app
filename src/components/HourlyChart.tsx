import { useDragScroll } from "@/lib/useDragScroll";
import { celsiusToUnit, formatHour, localizeDigits } from "@/lib/format";
import type { HourPoint, Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface HourlyChartProps {
  lang: Lang;
  unit: Unit;
  hours: HourPoint[];
}

const WIDTH = 720;
const PAD_X = 28;
const TOP = 44;
const CHART_HEIGHT = 90;
const AREA_BASE = TOP + CHART_HEIGHT + 14;
const RAIN_BASE = AREA_BASE + 62;
const RAIN_MAX_HEIGHT = 40;
const HEIGHT = RAIN_BASE + 36;

interface Point {
  x: number;
  y: number;
}

function smoothPath(points: Point[]): string {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function HourlyChart({ lang, unit, hours }: HourlyChartProps) {
  const dragRef = useDragScroll<HTMLDivElement>();
  if (hours.length < 2) return null;

  const rtl = lang === "fa";
  const temps = hours.map((h) => celsiusToUnit(h.temperature, unit));
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = Math.max(1, max - min);
  const last = hours.length - 1;

  const xAt = (i: number) => PAD_X + ((rtl ? last - i : i) * (WIDTH - PAD_X * 2)) / last;
  const yAt = (v: number) => TOP + (1 - (v - min) / span) * CHART_HEIGHT;

  const points = temps.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const line = smoothPath(points);
  const area = `${line} L ${points[last].x} ${AREA_BASE} L ${points[0].x} ${AREA_BASE} Z`;
  const peakIndex = temps.indexOf(max);
  const lowIndex = temps.indexOf(min);

  return (
    <div className="glass rounded-3xl p-4 sm:p-6 mt-4">
      <div className="flex items-center gap-5 text-xs text-mist mb-2">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-gold" />
          {t(lang, "chartTemp")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-cyan/60" />
          {t(lang, "chartRain")}
        </span>
      </div>

      <div ref={dragRef} tabIndex={0} role="region" aria-label={t(lang, "chartTemp")} className="drag-scroll overflow-x-auto scroll-quiet">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[640px]" role="img" aria-label={`${t(lang, "hourlyTitle")}. ${t(lang, "chartLow")}: ${localizeDigits(min, lang)}°, ${t(lang, "chartHigh")}: ${localizeDigits(max, lang)}°`}>
          <defs>
            <linearGradient id="hourlyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D9B979" stopOpacity="0.38" />
              <stop offset="1" stopColor="#D9B979" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hourlyLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#EAD6A8" />
              <stop offset="1" stopColor="#D9B979" />
            </linearGradient>
          </defs>

          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={TOP + (CHART_HEIGHT * i) / 2}
              y2={TOP + (CHART_HEIGHT * i) / 2}
              stroke="rgba(236,216,172,0.08)"
              strokeDasharray="3 6"
            />
          ))}

          <path d={area} fill="url(#hourlyFill)" />
          <path d={line} fill="none" stroke="url(#hourlyLine)" strokeWidth="2.5" strokeLinecap="round" />

          {points.map((p, i) => {
            const showLabel = i % 3 === 0 || i === peakIndex || i === lowIndex;
            const emphasised = i === peakIndex || i === lowIndex;
            return (
              <g key={hours[i].time}>
                {showLabel && (
                  <>
                    <circle cx={p.x} cy={p.y} r={emphasised ? 4.5 : 3} fill="#07080C" stroke="#D9B979" strokeWidth="2" />
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fontSize="13"
                      className={emphasised ? "fill-gold-soft" : "fill-paper"}
                    >
                      {localizeDigits(temps[i], lang)}°
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {hours.map((h, i) => {
            const barHeight = Math.max(2, (h.precipProbability / 100) * RAIN_MAX_HEIGHT);
            return (
              <rect
                key={h.time}
                x={xAt(i) - 5}
                y={RAIN_BASE - barHeight}
                width="10"
                height={barHeight}
                rx="3"
                className="fill-cyan/50"
              />
            );
          })}

          {hours.map((h, i) =>
            i % 4 === 0 ? (
              <text key={h.time} x={xAt(i)} y={HEIGHT - 8} textAnchor="middle" fontSize="12" className="fill-mist">
                {i === 0 ? t(lang, "now") : formatHour(h.time, lang)}
              </text>
            ) : null
          )}
        </svg>
      </div>
    </div>
  );
}
