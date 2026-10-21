import { Icon } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";
import type { Insight, InsightTone } from "@/lib/insights";
import type { Lang } from "@/types";
import { t } from "@/i18n";

interface BriefingProps {
  lang: Lang;
  displayFont: string;
  insights: Insight[];
}

const toneClass: Record<InsightTone, string> = {
  good: "border-[#7BC8A4]/40 bg-[#7BC8A4]/10 text-[#7BC8A4]",
  warn: "border-coral/45 bg-coral/10 text-coral",
  info: "border-gold/40 bg-gold/10 text-gold",
};

export function Briefing({ lang, displayFont, insights }: BriefingProps) {
  if (insights.length === 0) return null;

  return (
    <section id="briefing" aria-labelledby="briefing-title" className="mt-12 sm:mt-16 scroll-mt-24">
      <SectionTitle id="briefing-title" title={t(lang, "briefingTitle")} displayFont={displayFont} />
      <ul className="grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <li
            key={insight.tip}
            className="glass rounded-3xl p-4 sm:p-5 flex items-center gap-4 md:[&:last-child:nth-child(odd)]:col-span-2"
          >
            <span
              className={cn(
                "grid place-items-center h-11 w-11 shrink-0 rounded-2xl border",
                toneClass[insight.tone]
              )}
            >
              <Icon name={insight.icon} className="w-5 h-5" />
            </span>
            <p className="text-sm sm:text-[15px] leading-7 text-paper/90">{t(lang, insight.tip)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
