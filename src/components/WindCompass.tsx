import { compassLabel, speedSuffix } from "@/lib/format";
import type { Lang, Unit } from "@/types";
import { kmhToUnit, localizeDigits } from "@/lib/format";

interface WindCompassProps {
  lang: Lang;
  unit: Unit;
  speed: number;
  direction: number;
}

export function WindCompass({ lang, unit, speed, direction }: WindCompassProps) {
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0">
        <circle cx="32" cy="32" r="29" stroke="rgba(255,255,255,0.14)" strokeWidth="2" fill="none" />
        {[0, 90, 180, 270].map((d) => {
          const a = (d * Math.PI) / 180;
          const x1 = 32 + Math.sin(a) * 22;
          const y1 = 32 - Math.cos(a) * 22;
          const x2 = 32 + Math.sin(a) * 27;
          const y2 = 32 - Math.cos(a) * 27;
          return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />;
        })}
        <g style={{ transform: `rotate(${direction}deg)`, transformOrigin: "32px 32px" }}>
          <path d="M32 10 L38 34 L32 30 L26 34 Z" fill="#5FD4D6" />
        </g>
      </svg>
      <div>
        <p className="text-xl sm:text-2xl font-display">
          {localizeDigits(kmhToUnit(speed, unit), lang)}{" "}
          <span className="text-sm text-mist font-body">{speedSuffix(unit)}</span>
        </p>
        <p className="text-xs text-mist mt-0.5">{compassLabel(direction, lang)}</p>
      </div>
    </div>
  );
}
