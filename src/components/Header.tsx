import { Segmented } from "@/components/ui/segmented";
import type { Lang, Unit } from "@/types";
import { t } from "@/i18n";

interface HeaderProps {
  lang: Lang;
  unit: Unit;
  fontClass: string;
  displayFont: string;
  onLangChange: (lang: Lang) => void;
  onUnitChange: (unit: Unit) => void;
}

export function Header({ lang, unit, fontClass, displayFont, onLangChange, onUnitChange }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 mb-8 sm:mb-12">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0">
          <circle cx="20" cy="20" r="8" fill="#FFB648" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x1 = 20 + Math.cos(a) * 13, y1 = 20 + Math.sin(a) * 13;
            const x2 = 20 + Math.cos(a) * 17, y2 = 20 + Math.sin(a) * 17;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFB648" strokeWidth="2" strokeLinecap="round" opacity="0.85" />;
          })}
        </svg>
        <div>
          <p className={`${displayFont} text-lg sm:text-xl font-medium leading-tight`}>{t(lang, "brand")}</p>
          <p className="text-mist text-xs sm:text-sm">{t(lang, "tagline")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Segmented
          fontClass={fontClass}
          value={unit}
          onChange={(v) => onUnitChange(v as Unit)}
          options={[
            { value: "metric", label: "°C" },
            { value: "imperial", label: "°F" },
          ]}
        />
        <Segmented
          fontClass={fontClass}
          value={lang}
          onChange={(v) => onLangChange(v as Lang)}
          options={[
            { value: "fa", label: "فا" },
            { value: "en", label: "EN" },
          ]}
        />
      </div>
    </header>
  );
}
