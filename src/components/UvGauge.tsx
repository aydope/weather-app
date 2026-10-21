import { localizeDigits } from "@/lib/format";
import { uvLabel } from "@/lib/weatherMeta";
import type { Lang } from "@/types";

interface UvGaugeProps {
  lang: Lang;
  displayFont: string;
  uv: number;
}

function uvColor(uv: number): string {
  if (uv < 3) return "#7BC8A4";
  if (uv < 6) return "#E5C567";
  if (uv < 8) return "#E39A5C";
  if (uv < 11) return "#E0695F";
  return "#B07AD8";
}

export function UvGauge({ lang, displayFont, uv }: UvGaugeProps) {
  const fraction = Math.min(1, uv / 11);
  const r = 26;
  const circumference = Math.PI * r;
  const dash = circumference * fraction;
  const color = uvColor(uv);

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 64 40" className="w-16 h-10 shrink-0">
        <path d={`M 6 34 A ${r} ${r} 0 0 1 58 34`} stroke="rgba(236,216,172,0.18)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path
          d={`M 6 34 A ${r} ${r} 0 0 1 58 34`}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div>
        <p className={`${displayFont} text-2xl sm:text-3xl`}>{localizeDigits(Math.round(uv), lang)}</p>
        <p className="text-xs mt-1" style={{ color }}>
          {uvLabel(uv, lang)}
        </p>
      </div>
    </div>
  );
}
