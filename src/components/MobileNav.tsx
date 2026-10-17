import { Icon, type IconName } from "@/components/ui/icons";
import type { NavSection } from "@/components/Header";
import { cn } from "@/lib/utils";
import type { Lang } from "@/types";
import { t } from "@/i18n";

interface MobileNavProps {
  lang: Lang;
  sections: NavSection[];
  active: string;
}

const icons: Record<string, IconName> = {
  overview: "home",
  hourly: "clock",
  forecast: "calendar",
  air: "leaf",
  details: "gauge",
  sun: "sun",
};

export function MobileNav({ lang, sections, active }: MobileNavProps) {
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label={t(lang, "navLabel")}
      className="lg:hidden fixed z-40 inset-x-3 mx-auto max-w-sm bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <ul className="glass-pill glass-nav grid grid-flow-col auto-cols-fr gap-0.5 rounded-[26px] p-1.5">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="min-w-0">
              <a
                href={`#${s.id}`}
                aria-label={t(lang, s.labelKey)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-[20px] px-1 pt-2.5 pb-2 transition-colors",
                  isActive
                    ? "bg-gold/15 text-gold-soft"
                    : "text-mist hover:text-paper",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0 h-0.5 w-5 rounded-full bg-gold transition-opacity",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  name={icons[s.id] ?? "pin"}
                  className="w-5 h-5 shrink-0"
                />
                <span className="max-w-full truncate text-[10px] leading-none">
                  {t(lang, s.shortKey)}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
