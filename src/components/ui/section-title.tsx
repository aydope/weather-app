import type { ReactNode } from "react";

interface SectionTitleProps {
  id: string;
  title: string;
  displayFont: string;
  aside?: ReactNode;
}

export function SectionTitle({ id, title, displayFont, aside }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-4 mb-5 sm:mb-6">
      <span className="h-px w-8 shrink-0 bg-gold/70" />
      <h2 id={id} className={`${displayFont} text-2xl sm:text-3xl font-semibold leading-none`}>{title}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent rtl:bg-gradient-to-l" />
      {aside}
    </div>
  );
}
