import { Icon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { CONTRIBUTE_URL, REPO, REPO_URL } from "@/lib/config";
import { localizeDigits } from "@/lib/format";
import { useGithubStars } from "@/lib/useGithubStars";
import { cn } from "@/lib/utils";
import type { Lang } from "@/types";
import { t } from "@/i18n";

interface FooterProps {
  lang: Lang;
  displayFont: string;
}

function formatStars(count: number): string {
  return count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : String(count);
}

export function Footer({ lang, displayFont }: FooterProps) {
  const stars = useGithubStars(REPO);

  return (
    <footer className="relative z-10 mt-16 sm:mt-20 border-t border-gold/15 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <p
            className={`${displayFont} text-2xl font-semibold text-gold-gradient`}
          >
            {t(lang, "brand")}
          </p>
          <p className="text-mist text-sm leading-7 mt-2">
            {t(lang, "footerBlurb")}
          </p>
        </div>

        <div className="flex flex-wrap items-stretch gap-3">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 px-5 gap-2.5 border-gold/40",
            )}
          >
            <Icon name="github" className="w-5 h-5" />
            {t(lang, "starOnGithub")}
            {stars !== null && (
              <span className="flex items-center gap-1 ps-3 ms-1 border-s border-white/20 text-gold-soft">
                <Icon name="star" filled className="w-4 h-4 text-gold" />
                {localizeDigits(formatStars(stars), lang)}
              </span>
            )}
          </a>
          <a
            href={CONTRIBUTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "h-11 px-5")}
          >
            <Icon name="pr" className="w-5 h-5" />
            {t(lang, "contribute")}
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4 text-xs text-mist">
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-paper transition-colors"
          >
            {t(lang, "footerNote")}
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 hover:text-paper transition-colors"
          >
            <Icon name="arrowUp" className="w-4 h-4" />
            {t(lang, "backToTop")}
          </button>
        </div>
      </div>
    </footer>
  );
}
