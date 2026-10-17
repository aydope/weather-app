import type { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  displayFont: string;
  aside?: ReactNode;
}

export function SectionTitle({ title, displayFont, aside }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-4 mb-5 sm:mb-6">
      <span className="h-px w-8 shrink-0 bg-gold/70" />
      <h3
        className={`${displayFont} text-2xl sm:text-3xl font-semibold leading-none`}
      >
        {title}
      </h3>
      <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent rtl:bg-gradient-to-l" />
      {aside}
    </div>
  );
}
