import {
  compassLabel,
  kmhToUnit,
  localizeDigits,
  speedSuffix,
} from "@/lib/format";
import type { Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface WindCompassProps {
  lang: Lang;
  unit: Unit;
  displayFont: string;
  speed: number;
  direction: number;
  gusts?: number;
}

export function WindCompass({
  lang,
  unit,
  displayFont,
  speed,
  direction,
  gusts,
}: WindCompassProps) {
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0">
        <circle
          cx="32"
          cy="32"
          r="29"
          stroke="rgba(236,216,172,0.25)"
          strokeWidth="1.5"
          fill="none"
        />
        {[0, 90, 180, 270].map((d) => {
          const a = (d * Math.PI) / 180;
          const x1 = 32 + Math.sin(a) * 22;
          const y1 = 32 - Math.cos(a) * 22;
          const x2 = 32 + Math.sin(a) * 27;
          const y2 = 32 - Math.cos(a) * 27;
          return (
            <line
              key={d}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(236,216,172,0.45)"
              strokeWidth="1.5"
            />
          );
        })}
        <g
          style={{
            transform: `rotate(${direction}deg)`,
            transformOrigin: "32px 32px",
          }}
        >
          <path d="M32 10 L38 34 L32 30 L26 34 Z" fill="#D9B979" />
        </g>
      </svg>
      <div>
        <p className={`${displayFont} text-2xl sm:text-3xl`}>
          {localizeDigits(kmhToUnit(speed, unit), lang)}{" "}
          <span className="text-sm text-mist font-body">
            {speedSuffix(unit)}
          </span>
        </p>
        <p className="text-xs text-mist mt-1">
          {compassLabel(direction, lang)}
          {gusts !== undefined &&
            ` · ${t(lang, "gusts")} ${localizeDigits(kmhToUnit(gusts, unit), lang)}`}
        </p>
      </div>
    </div>
  );
}
