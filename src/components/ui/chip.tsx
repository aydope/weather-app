import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ className, active, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md px-4 h-10 text-sm transition-colors whitespace-nowrap",
        active
          ? "border-gold/60 bg-gold/15 text-paper"
          : "border-white/10 bg-ink/60 text-mist hover:text-paper hover:bg-white/10 hover:border-gold/30",
        className
      )}
      {...props}
    />
  );
}
