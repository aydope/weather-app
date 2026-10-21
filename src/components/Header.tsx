import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import type { Lang, Unit } from "@/types";
import { t } from "@/i18n";

export interface NavSection {
  id: string;
  labelKey: string;
  shortKey: string;
}

interface HeaderProps {
  lang: Lang;
  unit: Unit;
  fontClass: string;
  displayFont: string;
  sections: NavSection[];
  active: string;
  onLangChange: (lang: Lang) => void;
  onUnitChange: (unit: Unit) => void;
}

export function Header({ lang, unit, fontClass, displayFont, sections, active, onLangChange, onUnitChange }: HeaderProps) {

  return (
    <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/70 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#overview" className="flex items-center gap-3 shrink-0" aria-label={t(lang, "brand")}>
          <svg viewBox="0 0 40 40" className="w-9 h-9 shrink-0">
            <defs>
              <linearGradient id="brandGold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0" stopColor="#F3E3B8" />
                <stop offset="1" stopColor="#A8863F" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="url(#brandGold)" strokeWidth="1" />
            <circle cx="20" cy="20" r="5.5" fill="url(#brandGold)" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line
                  key={i}
                  x1={20 + Math.cos(a) * 10}
                  y1={20 + Math.sin(a) * 10}
                  x2={20 + Math.cos(a) * 13.5}
                  y2={20 + Math.sin(a) * 13.5}
                  stroke="url(#brandGold)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="leading-tight hidden min-[400px]:block">
            <p
              className={cn(
                displayFont,
                "text-xl font-semibold",
                lang === "en" && "uppercase tracking-[0.22em]"
              )}
            >
              {t(lang, "brand")}
            </p>
            <p className="hidden sm:block text-mist text-xs">{t(lang, "tagline")}</p>
          </div>
        </a>

        {sections.length > 0 && (
          <nav aria-label={t(lang, "navLabel")} className="hidden lg:flex items-center gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[13px] transition-colors",
                  active === s.id ? "bg-gold/15 text-gold-soft" : "text-mist hover:text-paper"
                )}
              >
                {t(lang, s.labelKey)}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
      </div>
    </header>
  );
}
