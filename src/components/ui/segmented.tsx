import { cn } from "@/lib/utils";

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  fontClass?: string;
}

export function Segmented({ options, value, onChange, className, fontClass }: SegmentedProps) {
  return (
    <div
      role="tablist"
      className={cn("glass-pill inline-flex h-11 items-center rounded-full p-1 gap-0.5", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "h-9 min-w-[2.25rem] sm:min-w-[2.75rem] rounded-full px-2.5 sm:px-3 text-sm transition-colors",
              fontClass,
              active
                ? "bg-gradient-to-b from-gold-soft to-gold-deep text-ink font-semibold shadow-[0_4px_14px_-4px_rgba(217,185,121,0.6)]"
                : "text-mist hover:text-paper"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
