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
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-white/[0.04] p-1 gap-0.5",
        className
      )}
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
              "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
              fontClass,
              active ? "bg-paper text-ink" : "text-mist hover:text-paper"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
