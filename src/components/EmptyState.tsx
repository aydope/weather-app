import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icons";
import type { Lang } from "@/types";
import { t } from "@/i18n";

interface EmptyStateProps {
  lang: Lang;
  displayFont: string;
  onPick: (query: string) => void;
  onLocate: () => void;
}

const popular = [
  { query: "Tehran", fa: "تهران", en: "Tehran" },
  { query: "Istanbul", fa: "استانبول", en: "Istanbul" },
  { query: "Dubai", fa: "دبی", en: "Dubai" },
  { query: "Paris", fa: "پاریس", en: "Paris" },
  { query: "London", fa: "لندن", en: "London" },
  { query: "Tokyo", fa: "توکیو", en: "Tokyo" },
  { query: "New York", fa: "نیویورک", en: "New York" },
];

export function EmptyState({
  lang,
  displayFont,
  onPick,
  onLocate,
}: EmptyStateProps) {
  return (
    <section className="glass glass-strong rounded-[32px] px-6 py-14 sm:py-20 text-center animate-rise-in overflow-hidden">
      <svg
        viewBox="0 0 120 120"
        className="w-24 h-24 mx-auto mb-8"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="emptyGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F3E3B8" />
            <stop offset="1" stopColor="#A8863F" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="56"
          stroke="url(#emptyGold)"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <circle
          cx="60"
          cy="60"
          r="44"
          stroke="url(#emptyGold)"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <circle cx="60" cy="60" r="14" fill="url(#emptyGold)" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={60 + Math.cos(a) * 24}
              y1={60 + Math.sin(a) * 24}
              x2={60 + Math.cos(a) * 33}
              y2={60 + Math.sin(a) * 33}
              stroke="url(#emptyGold)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <h2 className={`${displayFont} text-3xl sm:text-5xl font-semibold mb-3`}>
        {t(lang, "emptyTitle")}
      </h2>
      <p className="text-mist text-sm sm:text-base max-w-md mx-auto leading-7">
        {t(lang, "emptyBody")}
      </p>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={onLocate}>
          <Icon name="locate" className="w-5 h-5 text-gold" />
          {t(lang, "locate")}
        </Button>
      </div>

      <div className="mt-10">
        <p className="text-xs text-mist mb-3">{t(lang, "popularLabel")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popular.map((c) => (
            <Chip key={c.query} onClick={() => onPick(c.query)}>
              {c[lang]}
            </Chip>
          ))}
        </div>
      </div>
    </section>
  );
}
