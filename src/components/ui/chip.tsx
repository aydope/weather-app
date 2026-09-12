import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ className, active, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs sm:text-sm transition-colors whitespace-nowrap",
        active
          ? "border-cyan/50 bg-cyan/10 text-paper"
          : "border-line bg-white/[0.03] text-mist hover:text-paper hover:bg-white/[0.06]",
        className
      )}
      {...props}
    />
  );
}
