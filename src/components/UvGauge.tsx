import { localizeDigits } from "@/lib/format";
import { uvLabel } from "@/lib/weatherMeta";
import type { Lang } from "@/types";

interface UvGaugeProps {
  lang: Lang;
  uv: number;
}

export function UvGauge({ lang, uv }: UvGaugeProps) {
  const fraction = Math.min(1, uv / 11);
  const r = 26;
  const circumference = Math.PI * r; // half circle
  const dash = circumference * fraction;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 64 40" className="w-16 h-10 shrink-0">
        <path
          d={`M 6 34 A ${r} ${r} 0 0 1 58 34`}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 6 34 A ${r} ${r} 0 0 1 58 34`}
          stroke="#FF6B5E"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div>
        <p className="text-xl sm:text-2xl font-display">{localizeDigits(Math.round(uv), lang)}</p>
        <p className="text-xs text-mist mt-0.5">{uvLabel(uv, lang)}</p>
      </div>
    </div>
  );
}
